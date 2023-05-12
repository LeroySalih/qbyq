export type Question = {
    id: number, 
    term: string, 
    text: string,
    specItemId: number
};

export type Questions = { [key : number] : Question };

export type HistoryItem = {
    date: Date, 
    result: boolean; 
}

export type QueueType = 0 | 1 | 2;


export type QueueDescriptor = {
    id: number, 
    label: string
};


export type QueueDescriptors = {
    [key : number] : QueueDescriptor
};


export type QueueItem = {
    queueId: number,
    userId: number,
    dueDate: Date, 
    qId: number, 
    currentQueue: QueueType,
    history: HistoryItem[]
};

export type Queue = QueueItem[];

export type QueueTypeFilterFn = (qi:QueueItem) => boolean;
export type QueueTypeMoveUpFn = (qi:QueueItem) => Date;

export type QueueTypeFilter = {
    id: QueueType,
    label: string,
    filterFn: QueueTypeFilterFn,
    moveUpFn: QueueTypeMoveUpFn
}

export type QueueTypeFilters = {
    [key in QueueType] : QueueTypeFilter 
}

