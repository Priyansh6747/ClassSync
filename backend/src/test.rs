#[cfg(test)]
mod tests {
    use crate::models::main_data::{Batch, SlotRes};
    use crate::models::meta_data::{Subject, Subjects, Teacher, Teachers, TimeSlot, TimeTableMetaData};

    fn create_test_metadata() -> TimeTableMetaData {
        let subjects = vec![
            Subject {
                name: "Algorithm Design".to_string(),
                code: "CSE2101".to_string(),
                tag: "CSE".to_string(),
            },
            Subject {
                name: "Microprocessors".to_string(),
                code: "ECE3201".to_string(),
                tag: "ECE".to_string(),
            },
            Subject {
                name: "Quantum Physics Lab".to_string(),
                code: "PHY4301".to_string(),
                tag: "PHY".to_string(),
            },
        ];

        let teachers = vec![
            Teacher {
                abbreviation: "RK".to_string(),
                name: "Dr. Rajesh Kumar".to_string(),
            },
            Teacher {
                abbreviation: "SP".to_string(),
                name: "Prof. Sneha Patel".to_string(),
            },
        ];

        TimeTableMetaData {
            time: TimeSlot {
                start: 9,
                end: 17,
                duration: 50,
                relax_period: 10,
            },
            teachers: Teachers { list: Some(teachers) },
            subjects: Subjects::new(subjects),
        }
    }

    #[test]
    fn test_transform_complete_slot() {
        let metadata = create_test_metadata();

        let slot_res = SlotRes {
            slot_purpose: Some("Lecture".to_string()),
            batch: Some(vec!["F1".to_string(), "F2".to_string()]),
            course: Some("CSE2101".to_string()),
            room: Some("Room 101".to_string()),
            teacher: Some(vec!["RK".to_string()]), // Using abbreviation
        };

        let transformed = slot_res.transform(&metadata);

        assert_eq!(transformed.slot_type, Some("Lecture".to_string()));
        assert_eq!(transformed.room, Some("Room 101".to_string()));

        // Check batches
        let batches = transformed.batch.unwrap();
        assert_eq!(batches.len(), 2);
        assert_eq!(batches[0], Batch { prefix: "F".to_string(), distinction: 1 });
        assert_eq!(batches[1], Batch { prefix: "F".to_string(), distinction: 2 });

        // Check course
        let course = transformed.course.unwrap();
        assert_eq!(course.name, "Algorithm Design");
        assert_eq!(course.code, "CSE2101");
        assert_eq!(course.tag, "CSE");

        // Check teachers - should match by abbreviation
        let teachers = transformed.teacher.unwrap();
        assert_eq!(teachers.len(), 1);
        assert_eq!(teachers[0].abbreviation, "RK");
        assert_eq!(teachers[0].name, "Dr. Rajesh Kumar");
    }

    #[test]
    fn test_transform_with_all_batches() {
        let metadata = create_test_metadata();

        let slot_res = SlotRes {
            slot_purpose: Some("Assembly".to_string()),
            batch: Some(vec!["all".to_string()]),
            course: Some("PHY4301".to_string()),
            room: Some("Auditorium".to_string()),
            teacher: Some(vec!["SP".to_string()]), // Using abbreviation
        };

        let transformed = slot_res.transform(&metadata);

        // Check that all batches are included
        let batches = transformed.batch.unwrap();
        assert_eq!(batches.len(), 14); // F1-F11 + E15-E17

        // Check first few batches
        assert_eq!(batches[0], Batch { prefix: "F".to_string(), distinction: 1 });
        assert_eq!(batches[10], Batch { prefix: "F".to_string(), distinction: 11 });
        assert_eq!(batches[11], Batch { prefix: "E".to_string(), distinction: 15 });

        // Check course lookup
        let course = transformed.course.unwrap();
        assert_eq!(course.name, "Quantum Physics Lab");
        assert_eq!(course.code, "PHY4301");
        assert_eq!(course.tag, "PHY");

        // Check teacher lookup by abbreviation
        let teachers = transformed.teacher.unwrap();
        assert_eq!(teachers.len(), 1);
        assert_eq!(teachers[0].abbreviation, "SP");
        assert_eq!(teachers[0].name, "Prof. Sneha Patel");
    }

    #[test]
    fn test_transform_with_mixed_valid_invalid_batches() {
        let metadata = create_test_metadata();

        let slot_res = SlotRes {
            slot_purpose: Some("Lab".to_string()),
            batch: Some(vec!["F1".to_string(), "INVALID".to_string(), "F2".to_string()]),
            course: Some("ECE3201".to_string()),
            room: Some("Lab 1".to_string()),
            teacher: None,
        };

        let transformed = slot_res.transform(&metadata);

        // Should return None because one batch is invalid (parse_vec returns None on any failure)
        assert_eq!(transformed.batch, None);

        // Other fields should still work
        assert_eq!(transformed.slot_type, Some("Lab".to_string()));
        assert_eq!(transformed.room, Some("Lab 1".to_string()));
        assert_eq!(transformed.teacher, None);
    }

    #[test]
    fn test_transform_with_valid_batches_only() {
        let metadata = create_test_metadata();

        let slot_res = SlotRes {
            slot_purpose: Some("Tutorial".to_string()),
            batch: Some(vec!["F1".to_string(), "E15".to_string(), "F11".to_string()]),
            course: Some("CSE2101".to_string()),
            room: Some("Tutorial Room".to_string()),
            teacher: None,
        };

        let transformed = slot_res.transform(&metadata);

        let batches = transformed.batch.unwrap();
        assert_eq!(batches.len(), 3);
        assert_eq!(batches[0], Batch { prefix: "F".to_string(), distinction: 1 });
        assert_eq!(batches[1], Batch { prefix: "E".to_string(), distinction: 15 });
        assert_eq!(batches[2], Batch { prefix: "F".to_string(), distinction: 11 });
    }

    #[test]
    fn test_transform_multiple_teachers() {
        let metadata = create_test_metadata();

        let slot_res = SlotRes {
            slot_purpose: Some("Co-taught Class".to_string()),
            batch: Some(vec!["F1".to_string()]),
            course: Some("CSE2101".to_string()),
            room: Some("Room 102".to_string()),
            teacher: Some(vec!["RK".to_string(), "SP".to_string()]), // Multiple abbreviations
        };

        let transformed = slot_res.transform(&metadata);

        // Check teachers - should find both by abbreviation
        let teachers = transformed.teacher.unwrap();
        assert_eq!(teachers.len(), 2);

        // Sort by abbreviation to ensure consistent ordering
        let mut sorted_teachers = teachers;
        sorted_teachers.sort_by(|a, b| a.abbreviation.cmp(&b.abbreviation));

        assert_eq!(sorted_teachers[0].abbreviation, "RK");
        assert_eq!(sorted_teachers[0].name, "Dr. Rajesh Kumar");
        assert_eq!(sorted_teachers[1].abbreviation, "SP");
        assert_eq!(sorted_teachers[1].name, "Prof. Sneha Patel");
    }

    #[test]
    fn test_transform_invalid_teacher_abbreviation() {
        let metadata = create_test_metadata();

        let slot_res = SlotRes {
            slot_purpose: Some("Lecture".to_string()),
            batch: Some(vec!["F1".to_string()]),
            course: Some("CSE2101".to_string()),
            room: Some("Room 103".to_string()),
            teacher: Some(vec!["INVALID".to_string()]), // Non-existent abbreviation
        };

        let transformed = slot_res.transform(&metadata);

        // Should return None for teachers if abbreviation not found
        assert_eq!(transformed.teacher, None);

        // Other fields should still work
        assert_eq!(transformed.slot_type, Some("Lecture".to_string()));
        assert_eq!(transformed.room, Some("Room 103".to_string()));
    }

    #[test]
    fn test_transform_empty_slot() {
        let metadata = create_test_metadata();

        let slot_res = SlotRes {
            slot_purpose: None,
            batch: None,
            course: Some("CSE2101".to_string()),
            room: None,
            teacher: None,
        };

        let transformed = slot_res.transform(&metadata);

        assert_eq!(transformed.slot_type, None);
        assert_eq!(transformed.batch, None);
        assert_eq!(transformed.room, None);
        assert_eq!(transformed.teacher, None);

        // Course should still be found
        let course = transformed.course.unwrap();
        assert_eq!(course.code, "CSE2101");
    }

    #[test]
    fn test_transform_edge_case_batches() {
        let metadata = create_test_metadata();

        // Test with edge case batches
        let slot_res = SlotRes {
            slot_purpose: Some("Special Class".to_string()),
            batch: Some(vec!["E17".to_string(), "F11".to_string()]), // Edge cases
            course: Some("PHY4301".to_string()),
            room: Some("Special Room".to_string()),
            teacher: None,
        };

        let transformed = slot_res.transform(&metadata);

        let batches = transformed.batch.unwrap();
        assert_eq!(batches.len(), 2);
        assert_eq!(batches[0], Batch { prefix: "E".to_string(), distinction: 17 });
        assert_eq!(batches[1], Batch { prefix: "F".to_string(), distinction: 11 });
    }

    #[test]
    fn test_str_to_batch() {
        let batch = Batch{prefix: "F".into(), distinction:1};
        assert_eq!(Batch::new(&String::from("F1")).unwrap(), batch);
    }
    
    fn create_sample_slot_res(course: &str, teacher: &str, slot_type: &str) -> SlotRes {
        SlotRes {
            slot_purpose: Some(slot_type.to_string()),
            batch: Some(vec!["F1".to_string(), "F2".to_string()]),
            course: Some(course.to_string()),
            room: Some("Room 101".to_string()),
            teacher: Some(vec![teacher.to_string()]),
        }
    }

    #[test]
    fn test_timestamp_default() {
        let timestamp = crate::models::wrapper::TimeStamp::default();
        assert_eq!(timestamp.hr, 0);
        assert_eq!(timestamp.min, 0);
    }

    #[test]
    fn test_timestamp_creation() {
        let timestamp = crate::models::wrapper::TimeStamp { hr: 9, min: 30 };
        assert_eq!(timestamp.hr, 9);
        assert_eq!(timestamp.min, 30);
    }

    #[test]
    fn test_column_default() {
        let column = crate::models::wrapper::Column::default();
        assert_eq!(column.start_time.hr, 0);
        assert_eq!(column.start_time.min, 0);
        assert_eq!(column.duration, 0);
        assert_eq!(column.schedules.len(), 0);
    }

    #[test]
    fn test_column_res_default() {
        let column_res = crate::models::wrapper::ColumnRes::default();
        assert_eq!(column_res.start_time.hr, 0);
        assert_eq!(column_res.start_time.min, 0);
        assert_eq!(column_res.duration, 0);
        assert_eq!(column_res.schedules.len(), 0);
    }

    #[test]
    fn test_column_res_transform_empty_schedules() {
        let metadata = create_test_metadata();

        let column_res = crate::models::wrapper::ColumnRes {
            start_time: crate::models::wrapper::TimeStamp { hr: 9, min: 0 },
            duration: 50,
            schedules: Vec::new(),
        };

        let transformed = column_res.transform(&metadata);

        assert_eq!(transformed.start_time.hr, 9);
        assert_eq!(transformed.start_time.min, 0);
        assert_eq!(transformed.duration, 50);
        assert_eq!(transformed.schedules.len(), 0);
    }

    #[test]
    fn test_column_res_transform_single_schedule() {
        let metadata = create_test_metadata();

        let slot_res = create_sample_slot_res("CSE2101", "RK", "Lecture");

        let column_res = crate::models::wrapper::ColumnRes {
            start_time: crate::models::wrapper::TimeStamp { hr: 10, min: 30 },
            duration: 60,
            schedules: vec![slot_res],
        };

        let transformed = column_res.transform(&metadata);

        assert_eq!(transformed.start_time.hr, 10);
        assert_eq!(transformed.start_time.min, 30);
        assert_eq!(transformed.duration, 60);
        assert_eq!(transformed.schedules.len(), 1);

        // Check the transformed slot
        let slot = &transformed.schedules[0];
        assert_eq!(slot.slot_type, Some("Lecture".to_string()));
        assert_eq!(slot.room, Some("Room 101".to_string()));

        let course = slot.course.as_ref().unwrap();
        assert_eq!(course.code, "CSE2101");
        assert_eq!(course.name, "Algorithm Design");

        let teachers = slot.teacher.as_ref().unwrap();
        assert_eq!(teachers.len(), 1);
        assert_eq!(teachers[0].abbreviation, "RK");
        assert_eq!(teachers[0].name, "Dr. Rajesh Kumar");
    }
    
    #[test]
    fn test_column_res_transform_with_mixed_valid_invalid_slots() {
        let metadata = create_test_metadata();

        // Valid slot
        let valid_slot = create_sample_slot_res("CSE2101", "RK", "Lecture");

        // Invalid slot (non-existent course)
        let invalid_slot = SlotRes {
            slot_purpose: Some("Lab".to_string()),
            batch: Some(vec!["F1".to_string()]),
            course: Some("INVALID123".to_string()),
            room: Some("Lab 2".to_string()),
            teacher: Some(vec!["SP".to_string()]),
        };

        let column_res = crate::models::wrapper::ColumnRes {
            start_time: crate::models::wrapper::TimeStamp { hr: 11, min: 45 },
            duration: 90,
            schedules: vec![valid_slot, invalid_slot],
        };

        let transformed = column_res.transform(&metadata);

        assert_eq!(transformed.schedules.len(), 2);

        // First slot should be valid
        let slot1 = &transformed.schedules[0];
        assert!(slot1.course.is_some());
        assert_eq!(slot1.course.as_ref().unwrap().code, "CSE2101");

        // Second slot should have None for course (invalid course code)
        let slot2 = &transformed.schedules[1];
        assert!(slot2.course.is_none()); // Should be None because course doesn't exist
        assert_eq!(slot2.slot_type, Some("Lab".to_string())); // Other fields should still work
    }

    #[test]
    fn test_column_res_transform_preserves_time_fields() {
        let metadata = create_test_metadata();

        let column_res = crate::models::wrapper::ColumnRes {
            start_time: crate::models::wrapper::TimeStamp { hr: 23, min: 59 },
            duration: 1,
            schedules: vec![],
        };

        let transformed = column_res.transform(&metadata);

        assert_eq!(transformed.start_time.hr, 23);
        assert_eq!(transformed.start_time.min, 59);
        assert_eq!(transformed.duration, 1);
    }

    #[test]
    fn test_column_res_clone() {
        let slot_res = create_sample_slot_res("CSE2101", "RK", "Lecture");

        let column_res = crate::models::wrapper::ColumnRes {
            start_time: crate::models::wrapper::TimeStamp { hr: 12, min: 30 },
            duration: 75,
            schedules: vec![slot_res],
        };

        let cloned = column_res.clone();

        assert_eq!(cloned.start_time.hr, column_res.start_time.hr);
        assert_eq!(cloned.start_time.min, column_res.start_time.min);
        assert_eq!(cloned.duration, column_res.duration);
        assert_eq!(cloned.schedules.len(), column_res.schedules.len());
    }

    #[test]
    fn test_timestamp_clone() {
        let timestamp = crate::models::wrapper::TimeStamp { hr: 15, min: 45 };
        let cloned = timestamp.clone();

        assert_eq!(cloned.hr, timestamp.hr);
        assert_eq!(cloned.min, timestamp.min);
    }

    #[test]
    fn test_column_res_transform_with_empty_slot_fields() {
        let metadata = create_test_metadata();

        let empty_slot = SlotRes {
            slot_purpose: None,
            batch: None,
            course: None,
            room: None,
            teacher: None,
        };

        let column_res = crate::models::wrapper::ColumnRes {
            start_time: crate::models::wrapper::TimeStamp { hr: 8, min: 0 },
            duration: 50,
            schedules: vec![empty_slot],
        };

        let transformed = column_res.transform(&metadata);

        assert_eq!(transformed.schedules.len(), 1);

        let slot = &transformed.schedules[0];
        assert!(slot.slot_type.is_none());
        assert!(slot.batch.is_none());
        assert!(slot.course.is_none());
        assert!(slot.room.is_none());
        assert!(slot.teacher.is_none());
    }

    #[test]
    fn test_column_res_transform_boundary_time_values() {
        let metadata = create_test_metadata();

        let column_res = crate::models::wrapper::ColumnRes {
            start_time: crate::models::wrapper::TimeStamp { hr: 0, min: 0 },
            duration: u16::MAX,
            schedules: vec![],
        };

        let transformed = column_res.transform(&metadata);

        assert_eq!(transformed.start_time.hr, 0);
        assert_eq!(transformed.start_time.min, 0);
        assert_eq!(transformed.duration, u16::MAX);
    }
}
