import React, { useState } from 'react';
import { updateUserInfo } from '@/utils/client-api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User as UserIcon, Book, Users, Calendar, X, Save } from 'lucide-react';
import Image from 'next/image';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const EditStudentModal = ({ student, onClose }) => {
const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    full_name: student.full_name || '',
    email: student.email || '',
    section: student.section || '',
    roll_no: student.roll_no || '',
    gender: student.gender || '',
    age: student.age || '',
    student_id: student.student_id || '',
    avatar_url: student.avatar_url || '',
  });
  const [imagePreview, setImagePreview] = useState(student.avatar_url || null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log(formData, student._id);
      await updateUserInfo(formData, student._id);
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student profile updated successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to update student profile. Please try again.');
      // console.error('Error updating student profile:', error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
        </DialogHeader>

        <div className="pt-4">
          {/* Profile Picture */}
          <div className="flex justify-center mb-6">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-50 flex items-center justify-center">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt={formData.full_name || "Student"}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-12 w-12 text-gray-400" />
                )}
              </div>
            </div>
            
          </div>

          {/* Student Information */}
          <form onSubmit={handleSubmit}>
          <div className="space-y-1 col-span-2">
                <Label className="text-xs text-gray-500">Profile Image</Label>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                  <Input type="file" onChange={handleImageChange} />
                </div>
              </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Full Name</Label>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                  <UserIcon className="h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Email</Label>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                  <UserIcon className="h-4 w-4 text-gray-500" />
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Section</Label>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                  <Users className="h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    placeholder="Section"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Roll Number</Label>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                  <Book className="h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    name="roll_no"
                    value={formData.roll_no}
                    onChange={handleInputChange}
                    placeholder="Roll Number"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Gender</Label>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                  <UserIcon className="h-4 w-4 text-gray-500" />
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Age</Label>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <Input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Age"
                  />
                </div>
              </div>
             
            </div>
            <DialogFooter className='mt-4'>
              <Button type="button" onClick={onClose} className="button-outline">
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit" className="button">
                <Save className="h-4 w-4" />
                Update Student
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditStudentModal;