import { useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import Select from 'react-select';
import { getAllInventoryItems } from '../../../services/inventoryService';
import { updateInfirmaryRecord } from '../../../services/infirmaryService';

const customStyles = {
  menu: (provided) => ({
    ...provided,
    maxHeight: '200px',
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: '200px',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '8px'
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
      borderRadius: '4px'
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#888',
      borderRadius: '4px'
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#555'
    }
  })
};

const EditInfirmaryRecord = ({ isOpen, onClose, editData, onSuccess }) => {
  // const [formData, setFormData] = useState({
  //   consentFrom: '',
  //   consentDate: '',
  //   consentTime: '',
  //   complaints: '',
  //   otherComplaint: '',
  //   details: '',
  //   treatment: '',
  //   tablet: null,
  //   quantity: ''
  // });
  const [formData, setFormData] = useState({
    consentFrom: '',
    consentDate: '',
    consentTime: '',
    complaints: []
  });

  
  const [tablets, setTablets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);


  const [medicine, setMedicine] = useState(null);
const [quantity, setQuantity] = useState("");
useEffect(() => {
  console.log("EDIT DATA:", editData);
}, [editData]);
  // Initialize form with edit data
  // useEffect(() => {
  //   if (editData) {
  //     setFormData({
  //       consentFrom: editData.consentFrom || '',
  //       consentDate: editData.date ? editData.date.split('T')[0] : '',
  //       consentTime: editData.time || '',
  //       complaints: editData.complaints || '',
  //       otherComplaint: '',
  //       details: editData.details || '',
  //       treatment: editData.treatmentGiven || '',
  //       tablet: editData.medicineProvided ? {
  //         value: editData.medicineProvided.inventoryId,
  //         label: '', // This will be updated when tablets are fetched
  //         stock: 0
  //       } : null,
  //       quantity: editData.medicineProvided ? editData.medicineProvided.quantity.toString() : ''
  //     });
  //   }
  // }, [editData]);
  useEffect(() => {
  if (!editData) return;

  // -----------------------------
  // BASE FORM DATA
  // -----------------------------
  setFormData({
    consentFrom: editData.consentFrom || '',
    consentDate: editData.date ? editData.date.split('T')[0] : '',
    consentTime: editData.time || '',
    complaints: editData.complaints?.length
      ? editData.complaints.map(c => ({
          complaint: c.complaint,
          details: c.details || '',
          treatment: c.treatment || '',
          otherComplaint: ''
        }))
      : [{ complaint: '', details: '', treatment: '', otherComplaint: '' }]
  });

  // -----------------------------
  // MEDICINE PROVIDED (SAFE)
  // -----------------------------
  if (editData.medicineProvided) {
    const inventory = editData.medicineProvided.inventoryId;

    setMedicine({
      value: typeof inventory === 'object' ? inventory._id : inventory,
      label: typeof inventory === 'object'
        ? inventory.item_name
        : 'Selected Medicine',
      stock: typeof inventory === 'object'
        ? inventory.current_stock ?? 0
        : 0
    });

    setQuantity(
      editData.medicineProvided.quantity
        ? editData.medicineProvided.quantity.toString()
        : ''
    );
  } else {
    // Reset if no medicine exists
    setMedicine(null);
    setQuantity('');
  }

}, [editData]);

//   useEffect(() => {
//   if (!editData) return;

//   setFormData({
//     consentFrom: editData.consentFrom || '',
//     consentDate: editData.date?.split('T')[0] || '',
//     consentTime: editData.time || '',
//     complaints: editData.complaints?.length
//       ? editData.complaints.map(c => ({
//           complaint: c.complaint,
//           details: c.details || '',
//           treatment: c.treatment || '',
//           otherComplaint: ''
//         }))
//       : [{ complaint: '', details: '', treatment: '', otherComplaint: '' }]

      
//   });
  
// }, [editData]);


  useEffect(() => {
    const fetchTablets = async () => {
      try {
        setLoading(true);
        const response = await getAllInventoryItems();
        const inventoryItems = response.data.map(item => ({
          value: item._id,
          label: item.item_name,
          stock: item.current_stock
        }));
        setTablets(inventoryItems);

        // Update tablet label if we have editData
        if (editData?.medicineProvided) {
          const selectedTablet = inventoryItems.find(t => t.value === editData.medicineProvided.inventoryId);
          if (selectedTablet) {
            setFormData(prev => ({
              ...prev,
              tablet: selectedTablet
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching tablets:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchTablets();
    }
  }, [isOpen, editData]);

  if (!isOpen || !editData) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      // const recordData = {
      //   memberId: editData.memberId,
      //   date: formData.consentDate,
      //   time: formData.consentTime,
      //   consentFrom: formData.consentFrom.toLowerCase(),
      //   complaints: formData.complaints === 'Others' ? formData.otherComplaint : formData.complaints,
      //   details: formData.details,
      //   treatmentGiven: formData.treatment
      // };
      const recordData = {
        consentFrom: formData.consentFrom.toLowerCase(),
        date: formData.consentDate,
        time: formData.consentTime,
        complaints: formData.complaints.map(c => ({
          complaint: c.complaint === 'others' ? c.otherComplaint : c.complaint,
          details: c.details,
          treatment: c.treatment
        }))
      };

      // if (formData.tablet && formData.quantity) {
      //   recordData.medicineProvided = {
      //     inventoryId: formData.tablet.value,
      //     quantity: parseInt(formData.quantity, 10)
      //   };
      // }
      if (medicine && quantity) {
        recordData.medicineProvided = {
          inventoryId: medicine.value,
          quantity: Number(quantity)
        };
      }

      await updateInfirmaryRecord(editData._id, recordData);
      
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (error) {
      console.error('Error updating infirmary record:', error);
      alert(error.message || 'Failed to update record. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  //  20.12.25
  const addRow = () => {
  setFormData(prev => ({
    ...prev,
    complaints: [
      ...prev.complaints,
      { complaint: '', details: '', treatment: '', otherComplaint: '' }
    ]
  }));
};

const removeRow = (index) => {
  if (formData.complaints.length === 1) return;
  setFormData(prev => ({
    ...prev,
    complaints: prev.complaints.filter((_, i) => i !== index)
  }));
};

const updateRow = (index, field, value) => {
  const updated = [...formData.complaints];
  updated[index][field] = value;
  setFormData({ ...formData, complaints: updated });
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="px-6 py-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Edit Infirmary Record</h2>
            </div>
            <button 
              type="button" 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700"
            >
              <IoMdClose className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            {/* Record Info Section */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Created At</label>
                    <p className="text-gray-900 font-medium">
                      {new Date(editData.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Last Updated</label>
                    <p className="text-gray-900 font-medium">
                      {new Date(editData.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="bg-gray-50 rounded-lg p-4 border">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Consent From *
                  </label>
                  <select
                    value={formData.consentFrom}
                    onChange={(e) => handleInputChange('consentFrom', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                   <option value="parent">Parent</option>
                    <option value="guardian">Guardian</option>
                    <option value="teacher">Teacher</option>
                    <option value="school authority">School Authority</option>

                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Consent Date *
                  </label>
                  <input
                    type="date"
                    value={formData.consentDate}
                    onChange={(e) => handleInputChange('consentDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Consent Time *
                  </label>
                  <input
                    type="time"
                    value={formData.consentTime}
                    onChange={(e) => handleInputChange('consentTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Complaints *
                  </label>
                  <select
                    value={formData.complaints}
                    onChange={(e) => handleInputChange('complaints', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Complaint</option>
                    <option value="Fever">Fever</option>
                    <option value="Headache">Headache</option>
                    <option value="Stomach Pain">Stomach Pain</option>
                    <option value="Injury">Injury</option>
                    <option value="Others">Others</option>
                  </select>
                  {formData.complaints === 'Others' && (
                    <input
                      type="text"
                      value={formData.otherComplaint}
                      onChange={(e) => handleInputChange('otherComplaint', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Specify complaint"
                      required
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Details *
                  </label>
                  <input
                    type="text"
                    value={formData.details}
                    onChange={(e) => handleInputChange('details', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter details"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Treatment *
                  </label>
                  <input
                    type="text"
                    value={formData.treatment}
                    onChange={(e) => handleInputChange('treatment', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter treatment"
                    required
                  />
                </div>
              </div> */}
              {/* Complaints Section */}
              <div className="bg-gray-50 rounded-lg p-4 border mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md font-semibold text-gray-800">
                    Complaints
                  </h3>
                  <button
                    type="button"
                    onClick={addRow}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.complaints.map((row, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-3 items-end border p-3 rounded-md bg-white"
                    >
                      {/* Complaint */}
                      <div className="col-span-4">
                        <label className="label">Complaint</label>
                        <select
                          value={row.complaint}
                          onChange={e =>
                            updateRow(index, 'complaint', e.target.value)
                          }
                          className="input"
                          required
                        >
                          <option value="">Select</option>
                          <option value="fever">Fever</option>
                          <option value="headache">Headache</option>
                          <option value="injury">Injury</option>
                          <option value="others">Others</option>
                        </select>

                        {row.complaint === 'others' && (
                          <input
                            type="text"
                            placeholder="Specify other complaint"
                            value={row.otherComplaint}
                            onChange={e =>
                              updateRow(index, 'otherComplaint', e.target.value)
                            }
                            className="input mt-2"
                            required
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
                            updateRow(index, 'details', e.target.value)
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
                            updateRow(index, 'treatment', e.target.value)
                          }
                          className="input"
                        />
                      </div>

                      {/* Remove */}
                      <div className="col-span-1 flex justify-center">
                        <button
                          type="button"
                          onClick={() => removeRow(index)}
                          className="h-9 w-9 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>


              {/* <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tablets
                  </label>
                  <Select
                    value={formData.tablet}
                    onChange={(value) => handleInputChange('tablet', value)}
                    options={tablets}
                    className="w-full"
                    placeholder={loading ? "Loading tablets..." : "Search tablets..."}
                    isClearable
                    styles={customStyles}
                    maxMenuHeight={200}
                    isLoading={loading}
                    noOptionsMessage={() => loading ? "Loading tablets..." : "No tablets found"}
                    formatOptionLabel={option => (
                      <div className="flex justify-between">
                        <span>{option.label}</span>
                        <span className="text-gray-500">Stock: {option.stock}</span>
                      </div>
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="text"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter quantity"
                  />
                </div>
              </div> */}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t flex justify-end gap-4 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={submitting}
            >
              {submitting ? 'Updating...' : 'Update Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInfirmaryRecord; 