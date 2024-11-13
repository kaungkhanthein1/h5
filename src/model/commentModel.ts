export interface CommentProps {
  movieId: string;
  lowerDivHeight: any;
}

export interface Comment {
  id: number;
  movie_id: string;
  user: {
    id: number;
    nickname: string;
    avatar: string;
    level: string;
  };
  content: string;
  type: string;
  likes: number;
  create_time: string;
  replies?: any;
}

export interface Reply {
  id: number;
  comment_id: number;
  parent_id: number;
  user: {
    id: number;
    nickname: string;
    avatar: string;
    level: string;
  };
  content: string;
  create_time: string;
}