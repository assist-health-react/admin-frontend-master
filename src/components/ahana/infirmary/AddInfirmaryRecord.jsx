import { useEffect, useState } from "react";
import { IoMdClose, } from "react-icons/io";
import {  FaEye ,FaEdit ,FaTrash } from 'react-icons/fa';
import { toast } from "react-hot-toast";
//import { createInfirmaryRecord } from "../../../services/infirmaryService";
//import { getAllInventoryItems } from "../../../services/inventoryService";
import {
    createInfirmaryRecord,
  getAllInfirmaryRecords,
  deleteInfirmaryRecord,
  getStudentInfirmaryHistory ,
  getInfirmaryRecordById 
} from "../../../services/infirmaryService";
import { medicineList } from "./medicineList";
import Select from "react-select";

const AddInfirmaryRecord = ({
  isOpen,
  onClose,
   onEdit,   
  student,
  schoolId,
  nurseId,
  onSuccess
}) => {
  const [dateTime, setDateTime] = useState({
    date: "",
    day: "",
    time: ""
  });

  const [consentFrom, setConsentFrom] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [rows, setRows] = useState([
    { complaint: "", details: "", treatment: "", otherComplaint: "" }
  ]);
//20.12.25
const [medicines] = useState(medicineList);
const [medicine, setMedicine] = useState(null);
const [quantity, setQuantity] = useState("");
//get from DB
//   const [medicines, setMedicines] = useState([]);
// const [medicine, setMedicine] = useState(null);
// const [quantity, setQuantity] = useState("");
// useEffect(() => {
//   const fetchMedicines = async () => {
//     const res = await getAllInventoryItems();
//     setMedicines(
//       res.data.map(item => ({
//         value: item._id,
//         label: item.item_name,
//         stock: item.current_stock
//       }))
//     );
//   };

//   if (isOpen) fetchMedicines();
// }, [isOpen]);
  // -----------------------------
  // 20.12.25
  // -----------------------------
    const [history, setHistory] = useState([]);
        const [loadingHistory, setLoadingHistory] = useState(false);

       
        const [editData, setEditData] = useState(null);
        const fetchHistory = async () => {
    try {
        setLoadingHistory(true);
         const res = await getStudentInfirmaryHistory(student.id);
        setHistory(res.data || []);
    } catch (err) {
        console.error(err);
    } finally {
        setLoadingHistory(false);
    }
    };
    useEffect(() => {
    if (isOpen && student) {
        fetchHistory();
    }
    }, [isOpen, student]);

  // -----------------------------
  // Auto Date / Time
  // -----------------------------
  useEffect(() => {
    if (!isOpen) return;

    const now = new Date();
    setDateTime({
      date: now.toISOString().split("T")[0],
      day: now.toLocaleDateString("en-IN", { weekday: "long" }),
      time: now.toTimeString().slice(0, 5)
    });
  }, [isOpen]);

  if (!isOpen || !student) return null;

  // -----------------------------
  // Dynamic Rows
  // -----------------------------
  const addRow = () => {
    setRows([
      ...rows,
      { complaint: "", details: "", treatment: "", otherComplaint: "" }
    ]);
  };

  const removeRow = (index) => {
    if (rows.length === 1) return;
    setRows(rows.filter((_, i) => i !== index));
  };

  const updateRow = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  // -----------------------------
  // Submit
  // -----------------------------
//   const handleSubmit = async () => {
//     if (!consentFrom) {
//       toast.error("Consent From is required");
//       return;
//     }

//     const validRows = rows.filter(
//       r => r.complaint || r.otherComplaint
//     );

//     if (!validRows.length) {
//       toast.error("Add at least one complaint");
//       return;
//     }

//     const payload = {
//       studentId: student.id,
//       schoolId,
//       nurseId,
//       date: dateTime.date,
//       time: dateTime.time,
//       consentFrom,
//       complaints: validRows.map(r => ({
//         complaint:
//           r.complaint === "others" ? r.otherComplaint : r.complaint,
//         details: r.details,
//         treatment: r.treatment
//       }))
//     };

//     try {
//       setSubmitting(true);
//       await createInfirmaryRecord(payload);
//       toast.success("Infirmary record added successfully");
//       onSuccess?.();
//       onClose();
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message ||
//         "Failed to add infirmary record"
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };
const handleSubmit = async () => {
  // -----------------------------
  // BASIC VALIDATIONS
  // -----------------------------
  if (!consentFrom) {
    toast.error("Consent From is required");
    return;
  }

  const validRows = rows.filter(
    r => r.complaint || r.otherComplaint
  );

  if (!validRows.length) {
    toast.error("Add at least one complaint");
    return;
  }

  // -----------------------------
  // BUILD COMPLAINTS ARRAY
  // -----------------------------
  const complaintsPayload = validRows.map(r => ({
    complaint:
      r.complaint === "others" ? r.otherComplaint : r.complaint,
    details: r.details || "",
    treatment: r.treatment || ""
  }));

  // -----------------------------
  // BASE PAYLOAD
  // -----------------------------
  const payload = {
    studentId: student.id,
    schoolId,
    nurseId,
    date: dateTime.date,
    time: dateTime.time,
    consentFrom: consentFrom.toLowerCase(), // ENUM SAFE
    complaints: complaintsPayload
  };

  // -----------------------------
  // MEDICINE (OPTIONAL)
  // -----------------------------
//   if (medicine && quantity) {
//     if (Number(quantity) <= 0) {
//       toast.error("Quantity must be greater than 0");
//       return;
//     }

//     if (medicine.stock < Number(quantity)) {
//       toast.error("Quantity exceeds available stock");
//       return;
//     }
//     if (medicine && quantity > medicine.stock) {
//         toast.error("Quantity exceeds available stock");
//         return;
//         }

//     payload.medicineProvided = {
//       inventoryId: medicine.value,
//       quantity: Number(quantity)
//     };
//   }
        if (medicine && quantity) {
        if (Number(quantity) > medicine.stock) {
            toast.error("Quantity exceeds available stock");
            return;
        }

        payload.medicineProvided = {
            inventoryId: medicine.value, // string ID now
            quantity: Number(quantity)
        };
        }
  // -----------------------------
  // SUBMIT
  // -----------------------------
  try {
    setSubmitting(true);

    await createInfirmaryRecord(payload);
    await fetchHistory();

    toast.success("Infirmary record added successfully");

    onSuccess?.();
    onClose();
  } catch (err) {
    console.error("Create infirmary error:", err);

    toast.error(
      err.response?.data?.message ||
      "Failed to add infirmary record"
    );
  } finally {
    setSubmitting(false);
  }
};

// const handleEdit = async (recordId) => {
//   try {
//     const res = await getInfirmaryRecordById(recordId);
//     setEditData(res.data);
//   } catch (error) {
//     console.error(error);
//     alert("Failed to fetch record for editing");
//   }
// };
const handleEdit = (recordId) => {
  onEdit(recordId);     // ✅ tell parent FIRST
};

// const handleEdit = async (recordId) => {
//   try {
//     const res = await getInfirmaryRecordById(recordId);

//     // ✅ Close Add modal
//     onClose();

//     // ✅ Open Edit modal with full data
//     setEditData(res.data);
//   } catch (error) {
//     console.error(error);
//     alert("Failed to fetch record for editing");
//   }
// };

const handleDelete = async (recordId) => {
  if (!window.confirm("Are you sure you want to delete this record?")) return;

  try {
    await deleteInfirmaryRecord(recordId);
    fetchHistory();
  } catch (error) {
    console.error(error);
    alert(
      error.response?.data?.message || "Failed to delete record"
    );
  }
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-6xl rounded-lg shadow-xl">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Add Infirmary Record
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <IoMdClose size={22} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

          {/* Date / Day / Time */}
          <div className="grid grid-cols-3 gap-4">
            <Field label="Date" value={dateTime.date} />
            <Field label="Day" value={dateTime.day} />
            <Field label="Time" value={dateTime.time} />
          </div>

          {/* Student Info */}
          <div className="grid grid-cols-3 gap-4">
            <Field label="AssistHealth ID" value={student.studentId} />
            <Field label="Name" value={student.name} />
            <Field label="Gender" value={student.gender} />
            <Field label="Section" value={student.section} />
            <Field label="Grade / Class" value={student.class} />

            <div>
              <label className="label">Consent From *</label>
              <select
                value={consentFrom}
                onChange={e => setConsentFrom(e.target.value)}
                className="input"
              >
                <option value="">Select</option>
                <option value="parent">Parent</option>
                <option value="teacher">Teacher</option>
                <option value="guardian">Guardian</option>
                <option value="school authority">School Authority</option>
              </select>
            </div>
          </div>

          {/* Dynamic Complaints */}
          <div className="space-y-4">
            <button
              onClick={addRow}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add
            </button>

            {rows.map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-3 items-end border p-4 rounded-md bg-gray-50"
              >
                {/* Complaint */}
                <div className="col-span-4">
                  <label className="label">Complaints</label>
                  <select
                    value={row.complaint}
                    onChange={e => updateRow(index, "complaint", e.target.value)}
                    className="input"
                  >
                    <option value="">-- Select Complaint --</option>
                    <option value="fever">Fever</option>
                    <option value="headache">Headache</option>
                    <option value="injury">Injury</option>
                    <option value="others">Others</option>
                  </select>

                  {row.complaint === "others" && (
                    <input
                      type="text"
                      placeholder="Specify other complaint"
                      value={row.otherComplaint}
                      onChange={e =>
                        updateRow(index, "otherComplaint", e.target.value)
                      }
                      className="input mt-2"
                    />
                  )}
                </div>

                {/* Details */}
                <div className="col-span-4">
                  <label className="label">Details</label>
                  <textarea
                    rows={2}
                    value={row.details}
                    onChange={e =>
                      updateRow(index, "details", e.target.value)
                    }
                    className="input"
                  />
                </div>

                {/* Treatment */}
                <div className="col-span-3">
                  <label className="label">Treatment</label>
                  <textarea
                    rows={2}
                    value={row.treatment}
                    onChange={e =>
                      updateRow(index, "treatment", e.target.value)
                    }
                    className="input"
                  />
                </div>

                {/* Remove */}
                <div className="col-span-1 flex justify-center">
                  <button
                    onClick={() => removeRow(index)}
                    className="h-9 w-9 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
            {/* Invontarty - 20.12.25 */}
            {/* <div className="bg-gray-50 p-4 rounded-lg border mt-6">
                <h3 className="text-md font-semibold text-gray-800 mb-4">
                    Medicine Provided
                </h3>

                <div className="grid grid-cols-2 gap-4">
                   
                    <div>
                    <label className="label">Medicine</label>
                    // <Select
                    //     options={medicines}
                    //     value={medicine}
                    //     onChange={setMedicine}
                    //     isClearable
                    //     placeholder="Select medicine"
                    //     formatOptionLabel={opt => (
                    //     <div className="flex justify-between">
                    //         <span>{opt.label}</span>
                    //         <span className="text-sm text-gray-500">
                    //         Stock: {opt.stock}
                    //         </span>
                    //     </div>
                    //     )}
                    // />
                    <Select
                            options={medicines}
                            value={medicine}
                            onChange={setMedicine}
                            isClearable
                            placeholder="Select medicine"
                            formatOptionLabel={(opt) => (
                                <div className="flex justify-between">
                                <span>{opt.label}</span>
                                <span className="text-sm text-gray-500">
                                    Stock: {opt.stock}
                                </span>
                                </div>
                            )}
                            />
                            </div>

                  
                    <div>
                    <label className="label">Quantity</label>
                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                        className="input"
                        placeholder="Enter quantity"
                    />
                    </div>
                </div>
                </div> */}
          </div>
       


        {/* -----------------------------
                Infirmary History Table
                ----------------------------- */}
                <div className="mt-8">
                <h3 className="text-md font-semibold text-gray-800 mb-3">
                    Infirmary History
                </h3>

                <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr className="text-center text-sm font-medium text-gray-600">
                        <th className="px-4 py-2">S.No</th>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Complaints</th>
                        <th className="px-4 py-2">Consent From</th>
                        <th className="px-4 py-2">Action</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 bg-white">
                        {loadingHistory ? (
                        <tr>
                            <td colSpan="5" className="py-4 text-center">
                            Loading...
                            </td>
                        </tr>
                        ) : history.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="py-4 text-center text-gray-500">
                            No infirmary records found
                            </td>
                        </tr>
                        ) : (
                        history.map((row, index) => (
                            <tr key={row._id} className="text-center text-sm">
                            <td className="px-4 py-2">
                                {index + 1}
                            </td>

                            <td className="px-4 py-2">
                                {new Date(row.date).toLocaleDateString("en-IN")}
                            </td>

                            <td className="px-4 py-2 text-left">
                                {row.complaints
                                ?.map(c => c.complaint)
                                .join(", ")}
                            </td>

                            <td className="px-4 py-2 capitalize">
                                {row.consentFrom}
                            </td>

                         <td className="px-4 py-2">
                        <div className="flex justify-center gap-3">
                            <button
                            onClick={() => handleEdit(row._id)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                            >
                            <FaEdit />
                            </button>

                            <button
                            onClick={() => handleDelete(row._id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                            >
                            <FaTrash />
                            </button>
                        </div>
                        </td>

                            </tr>
                        ))
                        )}
                    </tbody>
                    </table>
                </div>
                </div>

                 </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save"}
          </button>
        </div>
               {/* Edit Modal */}
 
      </div>
    </div>
    
  );
  {/* View Modal */}
        {viewId && (
        <ViewInfirmaryDetails
            isOpen={true}
            recordId={viewId}
            student={student}
            onClose={() => setViewId(null)}
        />
        )}

 
};

/* -----------------------------
Reusable Readonly Field
----------------------------- */
const Field = ({ label, value }) => (
  <div>
    <label className="label">{label}</label>
    <input
      value={value || ""}
      readOnly
      className="input-readonly"
    />
  </div>
);


export default AddInfirmaryRecord;
