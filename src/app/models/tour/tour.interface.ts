import { Types } from "mongoose";

export interface ITourType {
    name: string;
}

export interface ITour {
    slug: string;
    title: string;
    description?: string;
    image?: string[];
    location?: string;
    costFrom?: number;
    startDate?: Date;
    endDate?: Date;
    include?: string[];
    exclude?: string[];
    amenities?: string[];
    tourPlan?: string[];
    maxGuest?: number;
    minAge?: number;
    division: Types.ObjectId;
    tourType: Types.ObjectId;
}
