
export interface IResultRespondent {
    respondent_id: number;
    answers: IAnswers[]
}

interface IAnswers {
    index_code: string;
    index_value: number;
    category: number;
}