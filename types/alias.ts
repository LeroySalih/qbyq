import {Database} from './supabase';

export type ArrayElement<ArrayType extends readonly unknown[]> = 
      ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type Spec = Database["public"]["Tables"]["Spec"]["Row"];
export type Specs = Array<Spec>;
export type SpecItem = Database["public"]["Tables"]["SpecItem"]["Row"];
export type PupilMarks = Database["public"]["Tables"]["PupilMarks"]["Row"];
export type Question = Database["public"]["Tables"]["Questions"]["Row"];
export type Profile = Database["public"]["Tables"]["Profile"]["Row"];
export type Class = Database["public"]["Tables"]["Classes"]["Row"];
export type ClassMembership = Database["public"]["Tables"]["ClassMembership"]["Row"];
export type ClassPaperResources = Database["public"]["Tables"]["ClassPaperResources"]["Row"];
export type GetPupilMarksBySpecItem = Database["public"]["Functions"]["fn_pupil_marks_by_spec_item"]["Returns"]
export type GetPupilMarksByAvailableMarks = Database["public"]["Functions"]["fn_pupil_marks_by_available_marks"]["Returns"]
export type GetPaperMarksForPupil = Database["public"]["Functions"]["fn_get_paper_data_for_pupil"]["Returns"]
export type GetPaperMarksForPupilItem = ArrayElement<GetPaperMarksForPupil>;
export type ClassPaper = Database["public"]["Tables"]["ClassPapers"]["Row"];
export type Paper = Database["public"]["Tables"]["Papers"]["Row"];

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
