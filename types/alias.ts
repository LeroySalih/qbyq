import {Database} from './supabase';



export type Spec = Database["public"]["Tables"]["Spec"]["Row"];
export type SpecItem = Database["public"]["Tables"]["SpecItem"]["Row"];
export type PupilMarks = Database["public"]["Tables"]["PupilMarks"]["Row"];
export type Question = Database["public"]["Tables"]["Questions"]["Row"];
export type Profile = Database["public"]["Tables"]["Profile"]["Row"];
export type Class = Database["public"]["Tables"]["Classes"]["Row"];
export type ClassMembership = Database["public"]["Tables"]["ClassMembership"]["Row"];

export type SpecData = {
    spec:Spec,
    specItem: SpecItem[]
}


export type ClassMembershipData = {
    pupilId: string;
} & {
    Classes: ({
        id: number;
    } & {
        tag: string | null;
    } & {
        title: string | null;
    } & {
        resources: JSON;
    }) | ({
        id: number;
    } & {
        tag: string | null;
    } & {
        title: string | null;
    } & {
        resources: JSON;
    })[] | null;
}
