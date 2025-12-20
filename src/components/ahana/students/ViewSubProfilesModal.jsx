import { useEffect, useState } from 'react';
import { FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import { studentsService } from '../../../services/studentsService';
import boyStudentIcon from '../../../assets/icons/boy-student.png';
import girlStudentIcon from '../../../assets/icons/girl-student.png';

const ViewSubProfilesModal = ({ isOpen, parentStudent, onClose, onEdit }) => {
  const [subProfiles, setSubProfiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && parentStudent?.id) {
      fetchSubProfiles();
    }
  }, [isOpen, parentStudent]);

  const fetchSubProfiles = async () => {
    setLoading(true);
    try {
      const res = await studentsService.getSubProfilesByParent(parentStudent.id);
      console.log(res)
      setSubProfiles(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this sub profile?')) return;
    await studentsService.deleteStudent(id);
    fetchSubProfiles();
  };

  const getAvatar = (s) => {
    if (s.profilePic) {
      return (
        <img
          src={s.profilePic}
          className="w-9 h-9 rounded-full object-cover"
        />
      );
    }
    return (
      <img
        src={s.gender === 'female' ? girlStudentIcon : boyStudentIcon}
        className="w-9 h-9"
      />
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-5xl rounded-lg shadow-xl">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">
            Sub Profiles – {parentStudent.name}
          </h2>
          <button onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Table */}
        <div className="p-6 overflow-x-auto">
          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : (
            <table className="min-w-full border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2">S.No</th>
                  <th className="px-4 py-2">Profile</th>
                  <th className="px-4 py-2">Student ID</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Class</th>
                  <th className="px-4 py-2">Section</th>
                  <th className="px-4 py-2">Gender</th>
                  <th className="px-4 py-2">Mobile</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {subProfiles.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-6 text-gray-500">
                      No sub profiles found
                    </td>
                  </tr>
                ) : (
                  subProfiles.map((s, i) => (
                    <tr key={s._id} className="border-t">
                      <td className="px-4 py-2">{i + 1}</td>
                      <td className="px-4 py-2">{getAvatar(s)}</td>
                      <td className="px-4 py-2">{s.memberId}</td>
                      <td className="px-4 py-2">{s.name}</td>
                      <td className="px-4 py-2">{s.studentDetails?.grade}</td>
                      <td className="px-4 py-2">{s.studentDetails?.section}</td>
                      <td className="px-4 py-2 capitalize">{s.gender}</td>
                      <td className="px-4 py-2">{s.phone}</td>
                      <td className="px-4 py-2 text-right flex justify-end gap-3">
                        <button
                          className="text-blue-600"
                          onClick={() => onEdit(s)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="text-red-600"
                          onClick={() => handleDelete(s._id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewSubProfilesModal;
