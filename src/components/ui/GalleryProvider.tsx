"use client";

import React from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

export const GalleryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <PhotoProvider
      maskOpacity={0.8}
      bannerVisible={false}
      speed={(type) => (type === 2 ? 300 : 400)}
      easing={(type) => (type === 2 ? "cubic-bezier(0.4, 0, 0.2, 1)" : "cubic-bezier(0.25, 0.8, 0.25, 1)")}
    >
      {children}
    </PhotoProvider>
  );
};

export const GalleryItem = ({ src, children }: { src: string; children: React.ReactNode }) => {
  return (
    <PhotoView src={src}>
      <div style={{ display: 'flex', width: '100%', height: '100%', cursor: 'pointer' }}>
        {children}
      </div>
    </PhotoView>
  );
};
