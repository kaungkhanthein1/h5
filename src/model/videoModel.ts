export interface Episode {
    episode_id: number | null;
    episode_name: string;
    play_url: string;  // Ensure this field is present if required
    from_code: string;
    ready_to_play: boolean;
  }
  