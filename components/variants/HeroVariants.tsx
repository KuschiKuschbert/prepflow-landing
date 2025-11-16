'use client';

import React from 'react';
import { HeroContent } from './HeroContent';
import { HeroBullets } from './HeroBullets';
import { HeroCTA } from './HeroCTA';
import { HeroImageGallery } from './HeroImageGallery';

interface HeroProps {
  t: (key: string, fallback?: string | any[]) => string | any[];
  handleEngagement?: (event: string) => void;
}

// Control Hero (Original)
export function ControlHero({ t, handleEngagement }: HeroProps) {
  return (
    <section id="hero" className="desktop:grid-cols-2 desktop:py-24 grid items-center gap-12 py-16">
      <HeroContent t={t} handleEngagement={handleEngagement} variant="control">
        <HeroBullets t={t} variant="control" />
        <HeroCTA t={t} handleEngagement={handleEngagement} variant="control" />
      </HeroContent>
      <HeroImageGallery
        gradientFrom="#29E7CD"
        gradientTo="#D925C7"
        overlayTitle="Live GP% Dashboard"
        overlayBg="#29E7CD"
        overlayText="black"
      />
    </section>
  );
}

// Variant A - Problem-Focused Hero
export function VariantAHero({ t, handleEngagement }: HeroProps) {
  return (
    <section id="hero" className="desktop:grid-cols-2 desktop:py-24 grid items-center gap-12 py-16">
      <HeroContent t={t} handleEngagement={handleEngagement} variant="variantA">
        <HeroBullets t={t} variant="variantA" />
        <HeroCTA t={t} handleEngagement={handleEngagement} variant="variantA" />
      </HeroContent>
      <HeroImageGallery
        gradientFrom="#D925C7"
        gradientTo="#29E7CD"
        overlayTitle="Profit Analysis Dashboard"
        overlayBg="#D925C7"
        overlayText="white"
      />
    </section>
  );
}

// Variant B - Results-Focused Hero
export function VariantBHero({ t, handleEngagement }: HeroProps) {
  return (
    <section id="hero" className="desktop:grid-cols-2 desktop:py-24 grid items-center gap-12 py-16">
      <HeroContent t={t} handleEngagement={handleEngagement} variant="variantB">
        <HeroBullets t={t} variant="variantB" />
        <HeroCTA t={t} handleEngagement={handleEngagement} variant="variantB" />
      </HeroContent>
      <HeroImageGallery
        gradientFrom="#3B82F6"
        gradientTo="#29E7CD"
        overlayTitle="Profit Optimization"
        overlayBg="#3B82F6"
        overlayText="white"
      />
    </section>
  );
}

// Variant C - Simple/Direct Hero
export function VariantCHero({ t, handleEngagement }: HeroProps) {
  return (
    <section id="hero" className="desktop:grid-cols-2 desktop:py-24 grid items-center gap-12 py-16">
      <HeroContent t={t} handleEngagement={handleEngagement} variant="variantC">
        <HeroBullets t={t} variant="variantC" />
        <HeroCTA t={t} handleEngagement={handleEngagement} variant="variantC" />
      </HeroContent>
      <HeroImageGallery
        gradientFrom="#29E7CD"
        gradientTo="#D925C7"
        overlayTitle="Cost Analysis Dashboard"
        overlayBg="#29E7CD"
        overlayText="black"
      />
    </section>
  );
}
