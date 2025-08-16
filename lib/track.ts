// Tracking library for A/B testing events
// Supports PostHog with fallback to local logging and Vercel Analytics custom events

import { track as vaTrack } from '@vercel/analytics/react';
import { getClientFlags } from './flags';

export interface TrackingEvent {
	event: string;
	properties?: Record<string, any>;
	timestamp?: number;
}

export interface TrackingProperties {
	experiment: string;
	variant: string;
	[key: string]: any;
}

// External tracking (optional). Keep safe and dependency-free by default
function trackWithPostHog(event: string, properties?: TrackingProperties): void {
	if (typeof window === 'undefined') return;
	try {
		// PostHog (if present)
		if ((window as any).posthog?.capture) {
			(window as any).posthog.capture(event, properties);
			return;
		}
		// Vercel Analytics custom event
		try {
			vaTrack(event, properties || {});
		} catch {}
		// Fallback to console for development only
		if (process.env.NODE_ENV === 'development') {
			console.log('📊 Tracking Event:', { event, properties });
		}
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			console.error('Tracking failed:', error);
		}
	}
}

// Local logging fallback
async function trackLocally(event: string, properties?: TrackingProperties): Promise<void> {
	try {
		const trackingData: TrackingEvent = {
			event,
			properties,
			timestamp: Date.now()
		};

		// Send to local API endpoint
		await fetch('/api/events', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(trackingData),
		});
	} catch (error) {
		console.error('Local tracking failed:', error);
		if (process.env.NODE_ENV === 'development') {
			console.log('📊 Local Tracking Event:', { event, properties });
		}
	}
}

// Main tracking function
export function track(
	event: string, 
	properties?: TrackingProperties
): void {
	// Append feature flags context to all events
	const flags = getClientFlags();
	const enriched = { ...(properties || {}), flags } as TrackingProperties;
	// Try PostHog/Vercel first
	trackWithPostHog(event, enriched);
	// Also track locally as backup
	trackLocally(event, enriched);
}

// Convenience functions for common events
export function trackPrimaryCTAClick(variant: string): void {
	track('primary_cta_click', {
		experiment: 'landing_ab_001',
		variant,
		element: 'hero_cta_button',
		position: 'above_fold'
	});
}

export function trackPurchaseComplete(variant: string): void {
	track('purchase_complete', {
		experiment: 'landing_ab_001',
		variant,
		amount: 29,
		currency: 'AUD',
		platform: 'gumroad'
	});
}

export function trackHeroCTAClick(variant: string): void {
	track('hero_cta_click', {
		experiment: 'landing_ab_001',
		variant,
		element: 'hero_cta_button',
		position: 'hero_section'
	});
}

export function trackScrollDepth(variant: string, depth: number): void {
	track('scroll_depth', {
		experiment: 'landing_ab_001',
		variant,
		depth,
		timestamp: Date.now()
	});
}

export function trackOutboundClick(variant: string, destination: string): void {
	track('outbound_click', {
		experiment: 'landing_ab_001',
		variant,
		destination,
		element: 'cta_button'
	});
}

export function trackGumroadClick(variant: string): void {
	track('outbound_click_gumroad', {
		experiment: 'landing_ab_001',
		variant,
		destination: 'gumroad',
		element: 'pricing_cta'
	});
}

export function trackLeadMagnetSubmit(variant: string): void {
	track('lead_magnet_submit', {
		experiment: 'landing_ab_001',
		variant,
		form: 'demo_request',
		position: 'below_fold'
	});
}

export function trackPageView(variant: string): void {
	track('page_view', {
		experiment: 'landing_ab_001',
		variant,
		page: 'landing',
		timestamp: Date.now()
	});
}

// Scroll depth tracking with Intersection Observer
export function setupScrollTracking(variant: string): void {
	if (typeof window === 'undefined') return;
	let scroll50Tracked = false;
	let scroll75Tracked = false;
	const trackScroll = () => {
		const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		const docHeight = document.documentElement.scrollHeight - window.innerHeight;
		const scrollPercent = (scrollTop / docHeight) * 100;
		if (scrollPercent >= 50 && !scroll50Tracked) {
			trackScrollDepth(variant, 50);
			scroll50Tracked = true;
		}
		if (scrollPercent >= 75 && !scroll75Tracked) {
			trackScrollDepth(variant, 75);
			scroll75Tracked = true;
		}
	};
	let ticking = false;
	const throttledTrackScroll = () => {
		if (!ticking) {
			requestAnimationFrame(() => {
				trackScroll();
				ticking = false;
			});
			ticking = true;
		}
	};
	window.addEventListener('scroll', throttledTrackScroll, { passive: true });
}

// Form tracking
export function setupFormTracking(variant: string): void {
	if (typeof window === 'undefined') return;
	const leadMagnetForm = document.querySelector('#lead-magnet form');
	if (leadMagnetForm) {
		leadMagnetForm.addEventListener('submit', () => {
			trackLeadMagnetSubmit(variant);
		});
	}
}

// CTA tracking
export function setupCTATracking(variant: string): void {
	if (typeof window === 'undefined') return;
	const ctaButtons = document.querySelectorAll('[data-event]');
	ctaButtons.forEach(button => {
		const eventType = button.getAttribute('data-event');
		button.addEventListener('click', () => {
			switch (eventType) {
				case 'primary_cta_click':
					trackPrimaryCTAClick(variant);
					break;
				case 'hero_cta_click':
					trackHeroCTAClick(variant);
					break;
				case 'outbound_click_gumroad':
					trackGumroadClick(variant);
					break;
				default:
					track(eventType || 'cta_click', {
						experiment: 'landing_ab_001',
						variant,
						element: button.tagName.toLowerCase(),
						text: button.textContent?.trim()
					});
			}
		});
	});
}

// Initialize all tracking
export function initializeTracking(variant: string): void {
	// Vercel Analytics custom page event in addition to our tracker
	try { 
		const flags = getClientFlags();
		vaTrack('page_view', { experiment: 'landing_ab_001', variant, flags }); 
	} catch {}
	trackPageView(variant);
	setupScrollTracking(variant);
	setupFormTracking(variant);
	setupCTATracking(variant);
}

export default {
	track,
	trackPrimaryCTAClick,
	trackPurchaseComplete,
	trackHeroCTAClick,
	trackScrollDepth,
	trackOutboundClick,
	trackGumroadClick,
	trackLeadMagnetSubmit,
	trackPageView,
	setupScrollTracking,
	setupFormTracking,
	setupCTATracking,
	initializeTracking
};
