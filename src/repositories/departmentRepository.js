// const Department = require("../models/Department");

let Departments = [
    {
        "id": 1,
        "name": "Cardiology",
        "description": "Department specializing in heart-related treatments.",
        "hospital_id": 1,
        "unit_id": 1,
        "createdAt": "2024-11-13T11:04:22.000Z",
        "updatedAt": "2024-11-13T11:04:22.000Z"
    },
    {
        "id": 2,
        "name": "Neurology",
        "description": "Department focusing on disorders of the nervous system.",
        "hospital_id": 1,
        "unit_id": 1,
        "createdAt": "2024-11-13T11:04:22.000Z",
        "updatedAt": "2024-11-13T11:04:22.000Z"
    },
    {
        "id": 3,
        "name": "Orthopedics",
        "description": "Department dealing with musculoskeletal issues.",
        "hospital_id": 1,
        "unit_id": 1,
        "createdAt": "2024-11-13T11:04:22.000Z",
        "updatedAt": "2024-11-13T11:04:22.000Z"
    },
    {
        "id": 4,
        "name": "Pediatrics",
        "description": "Department for medical care of infants, children, and adolescents.",
        "hospital_id": 1,
        "unit_id": 1,
        "createdAt": "2024-11-13T11:04:22.000Z",
        "updatedAt": "2024-11-13T11:04:22.000Z"
    },
    {
        "id": 5,
        "name": "Emergency Medicine",
        "description": "Department handling urgent and emergency situations.",
        "hospital_id": 1,
        "unit_id": 1,
        "createdAt": "2024-11-13T11:04:22.000Z",
        "updatedAt": "2024-11-13T11:04:22.000Z"
    }
]

const getDepartments = async (data) => {
    if (Departments.length > 0) return Departments;
    throw new Error('No Departments Found!!');
};



module.exports = { getDepartments };