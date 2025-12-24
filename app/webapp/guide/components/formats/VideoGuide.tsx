/**
 * Video guide component.
 * Displays video walkthroughs with chapter navigation and progress tracking.
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Icon } from '@/components/ui/Icon';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import type { VideoContent } from '../../data/guide-types';

interface VideoGuideProps {
  content: VideoContent;
  className?: string;
}

export function VideoGuide({ content, className = '' }: VideoGuideProps) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeChapter, setActiveChapter] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);

    // Check for active chapter
    if (content.chapters && content.chapters.length > 0) {
      const chapters = content.chapters;
      const chapter = chapters.findIndex(
        (ch, index) =>
          video.currentTime >= ch.time &&
          (index === chapters.length - 1 || video.currentTime < chapters[index + 1].time),
      );
      if (chapter !== -1 && chapter !== activeChapter) {
        setActiveChapter(chapter);
      }
    }

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [content.chapters, activeChapter]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      video.pause();
    } else {
      video.play();
    }
    setPlaying(!playing);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !muted;
    setMuted(!muted);
  };

  const seekToChapter = (chapterIndex: number) => {
    const video = videoRef.current;
    const chapter = content.chapters?.[chapterIndex];
    if (!video || !chapter) return;

    video.currentTime = chapter.time;
    setActiveChapter(chapterIndex);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = (parseFloat(e.target.value) / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Video player */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
        <video
          ref={videoRef}
          src={content.src}
          poster={content.poster}
          className="w-full"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
        />

        {/* Custom controls overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors hover:bg-black/20">
          <button
            onClick={togglePlay}
            className="rounded-full bg-black/60 p-4 backdrop-blur-sm transition-all hover:scale-110"
            aria-label={playing ? 'Pause' : 'Play'}
          >
            <Icon
              icon={playing ? Pause : Play}
              size="lg"
              className="text-[var(--foreground)]"
              aria-hidden={true}
            />
          </button>
        </div>

        {/* Progress bar */}
        <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <input
            type="range"
            min="0"
            max="100"
            value={duration ? (currentTime / duration) * 100 : 0}
            onChange={handleSeek}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--muted)] accent-[#29E7CD]"
            aria-label="Video progress"
          />
          <div className="mt-2 flex items-center justify-between text-xs text-[var(--foreground)]">
            <span>{formatTime(currentTime)}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="rounded p-1 transition-colors hover:bg-white/20"
                aria-label={muted ? 'Unmute' : 'Mute'}
              >
                <Icon icon={muted ? VolumeX : Volume2} size="sm" aria-hidden={true} />
              </button>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters */}
      {content.chapters && content.chapters.length > 0 && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <h3 className="mb-3 text-sm font-semibold text-[var(--foreground)]">Chapters</h3>
          <div className="space-y-2">
            {content.chapters.map((chapter, index) => (
              <button
                key={index}
                type="button"
                onClick={() => seekToChapter(index)}
                className={`w-full rounded-xl border p-3 text-left text-sm transition-colors ${
                  activeChapter === index
                    ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]'
                    : 'border-[var(--border)] bg-[var(--background)] text-[var(--foreground-secondary)] hover:border-[var(--border)] hover:bg-[var(--surface)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{chapter.title}</span>
                  <span className="text-xs text-[var(--foreground-subtle)]">
                    {formatTime(chapter.time)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
