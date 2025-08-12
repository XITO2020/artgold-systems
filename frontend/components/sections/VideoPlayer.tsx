// components/VideoPlayer.tsx
import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import styles from '@/wonderstyles/videoplayer.module.css';

interface Video {
  url: string;
  title: string;
}

const videos: Video[] = [
  { url: '/videos/video1.mp4', title: 'Video 1' },
  { url: '/videos/video2.mp4', title: 'Video 2' },
  { url: '/videos/video3.mp4', title: 'Video 3' },
  { url: '/videos/video4.mp4', title: 'Video 4' },
  { url: '/videos/video5.mp4', title: 'Video 5' },
  { url: '/videos/video6.mp4', title: 'Video 6' },
  { url: '/videos/video7.mp4', title: 'Video 7' },
];

const VideoPlayer: React.FC = () => {
  const [activeVideos, setActiveVideos] = useState<Video[]>(videos.slice(0, 3));
  const [inactiveVideos, setInactiveVideos] = useState<Video[]>(videos.slice(3));

  const handleVideoClick = (index: number) => {
    const newActiveVideo = inactiveVideos[index];
    const newInactiveVideos = [...inactiveVideos];
    newInactiveVideos.splice(index, 1);
    setInactiveVideos([...newInactiveVideos, activeVideos[0]]);
    setActiveVideos([newActiveVideo, ...activeVideos.slice(1)]);
  };

  return (
    <div className={`w-[80%] mx-auto ${styles.container}`}>
      <div className={`w-[70%] ${styles.videoContainer}`} >
        {activeVideos.map((video, index) => (
          <div key={index} className={` ${styles.videoWrapper}`}>
            <div className={styles.videoTitle}>{video.title}</div>
            <ReactPlayer url={video.url} controls width="100%" height="100%" />
          </div>
        ))}
      </div>
      <aside className={` ${styles.aside}`}>
        {inactiveVideos.map((video, index) => (
          <button
            key={index}
            className={`bg-accent text-accentFour hover:bg-accentOne hover:text-accentThree ${styles.videoButton}`}
            onClick={() => handleVideoClick(index)}
          >
            {video.title}
          </button>
        ))}
      </aside>
    </div>
  );
};

export default VideoPlayer;
