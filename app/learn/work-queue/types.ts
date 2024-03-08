export type Ticket = {
    id: number;
    userid: string;
    publicUrl: string;
    filePath: string;
    notes: string;
    machine: string;
    firstName: string;
    familyName: string;
    created_at: string;
    complete_date: string;
    status: string;
    isAdmin: boolean;
    isTech: boolean;
    tech_notes: string;
};


export type Tickets = Ticket[] | null; 

export type Profile = {id: string, isAdmin: string, isTech: string}