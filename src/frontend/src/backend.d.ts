import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SubmittedStudent {
    id: bigint;
    institution: string;
    name: string;
    rank?: bigint;
    year: bigint;
    section: string;
    submittedAt: bigint;
    department: string;
    examType: string;
}
export interface backendInterface {
    deleteSubmittedStudent(id: bigint): Promise<boolean>;
    getSubmittedStudents(): Promise<Array<SubmittedStudent>>;
    ping(): Promise<string>;
    submitStudent(name: string, institution: string, section: string, department: string, rank: bigint | null, examType: string, year: bigint): Promise<bigint>;
}
