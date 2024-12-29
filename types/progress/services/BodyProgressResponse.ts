export interface BodyProgressResponse {
  bodyProgress: BodyProgressCoordinates[];
}

export interface BodyProgressCoordinates {
  date: Date;
  bodyWeight: number;
  waistCircumference: number;
  hipCircumference: number;
  thighCircumference: number;
}
