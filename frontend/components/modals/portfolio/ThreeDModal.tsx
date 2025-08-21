"use client";

import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@ui/dialog';
import { Input } from "@ui/input";
import { Heart, Share, MessageSquare, RotateCw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useToast } from '@hooks/use-toast';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface ThreeDModalProps {
  isOpen: boolean;
  onClose: () => void;
  model: {
    id: string;
    title: string;
    description: string;
    url: string;
    thumbnail: string;
    likes: number;
  };
  comments?: Array<{
    id: string;
    content: string;
    user: {
      name: string;
      image: string;
    };
    createdAt: Date;
  }>;
}

export function ThreeDModal({
  isOpen,
  onClose,
  model,
  comments = []
}: ThreeDModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [liked, setLiked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const { data: session } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    if (!containerRef.current || !isOpen) return;

    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = isAutoRotate;

    // Load model
    const loader = new GLTFLoader();
    loader.load(model.url, (gltf) => {
      scene.add(gltf.scene);
      
      // Center and scale model
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2 / maxDim;
      gltf.scene.scale.multiplyScalar(scale);
      
      gltf.scene.position.sub(center.multiplyScalar(scale));
    });

    camera.position.z = 5;

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [isOpen, model.url, isAutoRotate]);

  const handleLike = async () => {
    if (!session) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to like models",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/portfolio/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: model.id })
      });

      if (!response.ok) throw new Error('Failed to like model');

      setLiked(true);
      toast({
        title: "Success",
        description: "Model liked successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like model",
        variant: "destructive"
      });
    }
  };

  const handleComment = async () => {
    if (!session) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to comment",
        variant: "destructive"
      });
      return;
    }

    if (!newComment.trim()) return;

    try {
      const response = await fetch('/api/portfolio/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: model.id, content: newComment })
      });

      if (!response.ok) throw new Error('Failed to post comment');

      setNewComment('');
      toast({
        title: "Success",
        description: "Comment posted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh]">
        <DialogHeader>
          <DialogTitle>{model.title}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-8 h-full">
          <div className="relative" ref={containerRef}>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-4 right-4 z-10"
              onClick={() => setIsAutoRotate(!isAutoRotate)}
            >
              <RotateCw className={`h-4 w-4 ${isAutoRotate ? 'text-primary' : ''}`} />
            </Button>
          </div>

          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <p className="text-muted-foreground mb-4">{model.description}</p>

              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLike}
                  disabled={liked}
                >
                  <Heart className={`h-4 w-4 mr-2 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                  {model.likes}
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Comments</h4>
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 p-3 bg-muted rounded-lg">
                    <img
                      src={comment.user.image}
                      alt={comment.user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-sm">{comment.user.name}</p>
                      <p className="text-sm text-muted-foreground">{comment.content}</p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Input
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button 
                onClick={handleComment}
                disabled={!newComment.trim()}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Post
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}