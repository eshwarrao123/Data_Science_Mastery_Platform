import { registerCourse } from "@/lib/curriculum/registry";
import { sqlCourse } from "./course";

registerCourse(sqlCourse, []);
