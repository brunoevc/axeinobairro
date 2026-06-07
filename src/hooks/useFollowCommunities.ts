import { useState, useEffect } from 'react';
import { storage } from '@/repositories/storage';
import { toast } from 'sonner';

const FOLLOWED_COMMUNITIES_KEY = 'axei_followed_communities';

export function useFollowCommunities() {
  const [followedIds, setFollowedIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = storage.get<string[]>(FOLLOWED_COMMUNITIES_KEY, []);
    setFollowedIds(saved);
  }, []);

  const toggleFollow = (id: string, name?: string) => {
    const isFollowing = followedIds.includes(id);
    let newFollowed: string[];

    if (isFollowing) {
      newFollowed = followedIds.filter(fId => fId !== id);
      toast.info(`Você deixou de seguir ${name || 'esta comunidade'}`);
    } else {
      newFollowed = [...followedIds, id];
      toast.success(`Agora você está seguindo ${name || 'esta comunidade'}!`);
    }

    setFollowedIds(newFollowed);
    storage.set(FOLLOWED_COMMUNITIES_KEY, newFollowed);
  };

  const isFollowing = (id: string) => followedIds.includes(id);

  return { followedIds, toggleFollow, isFollowing };
}
