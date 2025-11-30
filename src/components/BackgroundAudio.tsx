import { useEffect, useRef, useState } from 'react';

const AUDIO_PATH = '/src/audio/flute.m4a';

export default function BackgroundAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playbackBlocked, setPlaybackBlocked] = useState(false);

  // If there's no stored preference, show a consent prompt on first load.
  const [showPrompt, setShowPrompt] = useState<boolean>(() => {
    try {
      return localStorage.getItem('bgAudioMuted') === null;
    } catch {
      return true;
    }
  });

  // Default to muted while waiting for user's choice; if a stored preference exists use it.
  const [muted, setMuted] = useState<boolean>(() => {
    try {
      const v = localStorage.getItem('bgAudioMuted');
      return v === null ? true : v === 'true';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const audio = new Audio(AUDIO_PATH);
    audio.loop = true;
    audio.volume = 0.08; // play lightly in the background
    audio.muted = muted;
    audio.preload = 'auto';
    audioRef.current = audio;

    // Try to play automatically only if we are not showing the consent prompt.
    const tryPlay = async () => {
      try {
        await audio.play();
        setPlaybackBlocked(false);
      } catch (err) {
        setPlaybackBlocked(true);
      }
    };

    if (!showPrompt) {
      tryPlay();
    }

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted;
      // ensure playing state after toggling mute
      audioRef.current.play().catch(() => {
        // if play fails after toggling, mark as blocked so UI can guide user
        setPlaybackBlocked(true);
      });
    }
    try {
      localStorage.setItem('bgAudioMuted', String(muted));
    } catch {}
  }, [muted]);

  // If autoplay was blocked, try to play on the first user interaction
  useEffect(() => {
    if (!playbackBlocked) return;

    const tryEnable = async () => {
      const audio = audioRef.current;
      if (!audio) return;
      try {
        await audio.play();
        setPlaybackBlocked(false);
        setMuted(false);
      } catch {
        // still blocked; keep waiting for next interaction
      }
    };

    const handler = () => {
      tryEnable();
      // remove after first attempt
      window.removeEventListener('pointerdown', handler);
      window.removeEventListener('keydown', handler);
    };

    window.addEventListener('pointerdown', handler);
    window.addEventListener('keydown', handler);

    return () => {
      window.removeEventListener('pointerdown', handler);
      window.removeEventListener('keydown', handler);
    };
  }, [playbackBlocked]);

  const toggleMute = async () => {
    const next = !muted;
    setMuted(next);
    try {
      localStorage.setItem('bgAudioMuted', String(next));
    } catch {}
    const audio = audioRef.current;
    if (audio && !next) {
      try {
        await audio.play();
        setPlaybackBlocked(false);
      } catch {
        setPlaybackBlocked(true);
      }
    }
  };

  // Handlers for the consent prompt
  const acceptAudio = async () => {
    setShowPrompt(false);
    setMuted(false);
    try {
      localStorage.setItem('bgAudioMuted', 'false');
    } catch {}
    const audio = audioRef.current;
    if (audio) {
      try {
        await audio.play();
        setPlaybackBlocked(false);
      } catch {
        setPlaybackBlocked(true);
      }
    }
  };

  const declineAudio = () => {
    setShowPrompt(false);
    setMuted(true);
    try {
      localStorage.setItem('bgAudioMuted', 'true');
    } catch {}
  };

  return (
    <>
      {showPrompt && (
        <div style={promptBackdropStyle}>
          <div style={promptStyle} role="dialog" aria-modal="true">
            <p style={{ marginBottom: 12 }}>Do you want to enable background sound while browsing the site?</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button onClick={acceptAudio} style={promptButtonStyle}>Yes — enable</button>
              <button onClick={declineAudio} style={promptButtonStyle}>No — keep off</button>
            </div>
            <small style={{ display: 'block', marginTop: 10, color: '#666' }}>You can change this later with the speaker control.</small>
          </div>
        </div>
      )}

      <div style={containerStyle}>
        <button
          aria-label={muted ? 'Unmute background audio' : 'Mute background audio'}
          onClick={toggleMute}
          style={buttonStyle}
          title={playbackBlocked ? 'Playback blocked — click to enable audio' : (muted ? 'Unmute background audio' : 'Mute background audio')}
        >
          {muted ? (playbackBlocked ? '🔇' : '🔈') : '🎵'}
        </button>
      </div>
    </>
  );
}

const containerStyle: React.CSSProperties = {
  position: 'fixed',
  right: 12,
  bottom: 12,
  zIndex: 9999,
};

const buttonStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.85)',
  border: '1px solid rgba(0,0,0,0.08)',
  padding: '6px 8px',
  borderRadius: 8,
  boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
  cursor: 'pointer',
  fontSize: 16,
};

const promptBackdropStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.35)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10000,
};

const promptStyle: React.CSSProperties = {
  background: '#fff',
  padding: 20,
  borderRadius: 8,
  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
  maxWidth: 360,
  textAlign: 'center',
};

const promptButtonStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: 6,
  border: 'none',
  cursor: 'pointer',
  background: '#111827',
  color: '#fff',
};
