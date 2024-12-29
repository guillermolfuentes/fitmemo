export interface MuscularGroupVolumeProgressResponse {
  volumeProgressCoordinates: MuscularGroupVolumeProgressCoordinates[];
}

export interface MuscularGroupVolumeProgressCoordinates {
  date: string;
  totalVolume: number;
}
