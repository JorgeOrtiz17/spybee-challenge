export interface Incident {
  id: string;
  sequenceId: string;

  title: string;
  description: string;

  priority: "low" | "medium" | "high";

  status:
    | "open"
    | "closed"
    | "on_pause";

  approval: boolean;

  locationDescription: string;

  coordinates: {
    lat: number;
    lng: number;
  };

  createdAt: string;

  updatedAt: string;

  project: {
    id: string;
    name: string;
  };

  owner: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
  };

  media: any[];

  tags: {
    id: string;
    name: string;
    color: string;
  }[];
}