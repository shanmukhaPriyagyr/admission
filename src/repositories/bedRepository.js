const Bed = require('../models/Bed');
const BedType = require('../models/BedType');
const Floor = require('../models/Floor');
const Ward = require('../models/Ward');
const BedGroup = require('../models/BedGroup');
const Blocks = require('../models/Blocks');
// const Department = require('../models/Department');
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

const createBed = async (data) => {
  const { bed_type_id, bed_group_id, ward_id, floor_id, name, is_active } = data;

  // Validate linked records (optional, if foreign keys are enforced, this might be redundant)
  const bedType = await BedType.findByPk(bed_type_id);
  const floor = await Floor.findByPk(floor_id);
  const ward = await Ward.findByPk(ward_id);
  const bedGroup = bed_group_id ? await BedGroup.findByPk(bed_group_id) : null;

  if (!bedType || !floor || !ward || (bed_group_id && !bedGroup)) {
    throw new Error('Invalid bed type, floor, ward, or bed group');
  }

  return await Bed.create({ bed_type_id, bed_group_id, ward_id, floor_id, name, is_active });
};

const getBeds = async () => {
  return await Bed.findAll({
    include: [
      { model: BedType, as: 'bedType' },
      { model: Floor, as: 'floor' },
      { model: Ward, as: 'ward' },
      { model: BedGroup, as: 'bedGroup' },
    ],
  });
};

const getAvailableBedsCount = async () => {
  return await Bed.count({
    where: { is_available: true }
  });
};

const getBedsByGroup = async (id, departments) => {
  const beds = await Bed.findAll({
    where: {
      bed_group_id: id
    },
    include: [
      { model: BedType, as: 'bedType' },
      { model: Floor, as: 'floor' },
      { model: Ward, as: 'ward', where: { isEmergency: false } },
      { model: BedGroup, as: 'bedGroup' },
      { model: Blocks, as: 'block' }
    ],
  });

  let groupId = 1;
  const groupedBeds = beds.reduce((result, bed) => {
    const floorName = bed.floor.name;
    const wardName = bed.ward.name;
    const typeName = bed.bedType.name;
    const block = bed.block.name;

    // Get the department details from the departments array
    const departmentDetails = Departments.find(dep => dep.id === bed.bed_department_id) || {};

    const groupKey = `${floorName}-${wardName}-${typeName}-${block}`;

    if (!result[groupKey]) {
      result[groupKey] = {
        id: groupId++,
        floor: floorName,
        ward: wardName,
        type: typeName,
        block: block,
        department: departmentDetails.name || "Unknown",
        beds: []
      };
    }

    result[groupKey].beds.push({
      id: bed.id,
      status: bed.is_available ? "Available" : "Occupied",
      name: bed.name || "Unknown",
    });

    return result;
  }, {});

  return Object.values(groupedBeds);
};

const updateBed = async (id, data) => {
  const bed = await Bed.findByPk(id);
  if (!bed) throw new Error('Bed not found');

  const { bed_type_id, bed_group_id, ward_id, floor_id, name, is_active } = data;

  return await bed.update({ bed_type_id, bed_group_id, ward_id, floor_id, name, is_active });
};

const deleteBed = async (id) => {
  const bed = await Bed.findByPk(id);
  if (!bed) throw new Error('Bed not found');
  return await bed.destroy();
};

const getEmergencyBeds = async (hospital_id, unit_id) => {
  const beds = await Bed.findAll({
    include: [
      { model: BedType, as: 'bedType' },
      { model: Floor, as: 'floor' },
      { model: Ward, as: 'ward', where: { isEmergency: true } },
      { model: BedGroup, as: 'bedGroup' },
      { model: Blocks, as: 'block', where: { hospital_id, unit_id } }
    ],
  });

  let groupId = 1;
  const groupedBeds = beds.reduce((result, bed) => {
    const floorName = bed.floor.name;
    const wardName = bed.ward.name;
    const typeName = bed.bedType.name;
    const block = bed.block.name;

    // Get the department details from the departments array
    const departmentDetails = Departments.find(dep => dep.id === bed.bed_department_id) || {};

    const groupKey = `${floorName}-${wardName}-${typeName}-${block}`;

    if (!result[groupKey]) {
      result[groupKey] = {
        id: groupId++,
        floor: floorName,
        ward: wardName,
        type: typeName,
        block: block,
        department: departmentDetails.name || "Unknown",
        beds: []
      };
    }

    result[groupKey].beds.push({
      id: bed.id,
      status: bed.is_available ? "Available" : "Occupied",
      name: bed.name || "Unknown",
    });

    return result;
  }, {});

  return Object.values(groupedBeds);
};

const updateBedStatus = async (id, is_available) => {
  const bed = await Bed.findByPk(id);
  if (!bed) throw new Error('Bed not found');
  
  return await bed.update({ is_available: is_available });
}

module.exports = { createBed, getBeds, updateBed, deleteBed, getBedsByGroup, getAvailableBedsCount, getEmergencyBeds, updateBedStatus };
