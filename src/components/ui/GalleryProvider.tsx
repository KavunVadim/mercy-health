"use client";

import React from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

export const GalleryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <PhotoProvider
      maskOpacity={0.8}
      bannerVisible={false}
      speedOut={300}
      easingOut="cubic-bezier(0.4, 0, 0.2, 1)"
    >
      {children}
    </PhotoProvider>
  );
};

export const GalleryItem = ({ src, children }: { src: string; children: React.ReactNode }) => {
  return (
    <PhotoView src={src}>
      <div style={{ cursor: 'pointer' }}>
        {children}
      </div>
    </PhotoView>
  );
};
