export default class Internship{
    id?: number;
    internship_subject: string;
    internship_desc: string | null;
    internship_duration: string | null;
    internship_person_num: number | null;
    internship_tech: string | null;
    internship_department: string | null;
    constructor( 
        internship_subject: string,
        internship_desc: string | null,
        internship_duration: string | null,
        internship_person_num: number | null,
        internship_tech: string | null,
        internship_department: string | null,
        id?: number
        ){
            this.id=id;
            this.internship_department=internship_department;
            this.internship_tech=internship_tech;
            this.internship_person_num=internship_person_num;
            this.internship_duration=internship_duration;
            this.internship_desc=internship_desc;
            this.internship_subject=internship_subject;

    }
    
}