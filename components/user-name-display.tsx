import React from 'react';

interface UserNameDisplayProps {
  profile: {
    fontColor: string;
    fontFamily: string;
    displayName: string;
  };
}

export function UserNameDisplay({ profile }: UserNameDisplayProps) {
  return (
    <span
      style={{
        color: profile.fontColor,
        fontFamily: profile.fontFamily === 'serif' ? 'serif' :
                   profile.fontFamily === 'mono' ? 'monospace' :
                   profile.fontFamily === 'cursive' ? 'cursive' :
                   profile.fontFamily === 'fantasy' ? 'fantasy' : 'sans-serif'
      }}
      className="font-medium"
    >
      {profile.displayName}
    </span>
  );
}