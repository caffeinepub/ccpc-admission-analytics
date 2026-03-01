import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface StarAnnouncement {
    id: bigint;
    createdAt: bigint;
    text: string;
    emoji: string;
}
export interface OverviewSettings {
    med2024Bangla: string;
    med2025Badge: string;
    med2024Total: string;
    cardLabel0: string;
    cardLabel1: string;
    cardLabel2: string;
    cardLabel3: string;
    trendMed2024: bigint;
    trendMed2025: bigint;
    growthOverride: string;
    yoySubtitle: string;
    trendBuet2024: bigint;
    med2024English: string;
}
export interface SubmittedStudent {
    id: bigint;
    hasStarAchievement: boolean;
    starNote?: string;
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
    addStarAnnouncement(emoji: string, text: string, sessionToken: string): Promise<bigint>;
    adminLogin(collegeId: string, email: string, password: string): Promise<string | null>;
    deleteSubmittedStudent(id: bigint): Promise<boolean>;
    editStarAnnouncement(id: bigint, emoji: string, text: string, sessionToken: string): Promise<boolean>;
    getAdminList(sessionToken: string): Promise<Array<[string, string]>>;
    getOverviewSettings(): Promise<OverviewSettings>;
    getStarAnnouncements(): Promise<Array<StarAnnouncement>>;
    getSubmittedStudents(): Promise<Array<SubmittedStudent>>;
    grantStarAchievement(studentId: bigint, sessionToken: string, note: string): Promise<boolean>;
    initializeDefaultAdmin(): Promise<void>;
    isSessionValid(token: string): Promise<boolean>;
    ping(): Promise<string>;
    registerAdmin(collegeId: string, email: string, password: string, name: string, sessionToken: string): Promise<boolean>;
    removeStarAchievement(studentId: bigint, sessionToken: string): Promise<boolean>;
    removeStarAnnouncement(id: bigint, sessionToken: string): Promise<boolean>;
    submitStudent(name: string, institution: string, section: string, department: string, rank: bigint | null, examType: string, year: bigint): Promise<bigint>;
    updateOverviewSettings(settings: OverviewSettings, sessionToken: string): Promise<boolean>;
}
