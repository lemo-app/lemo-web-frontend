"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { School } from "@/utils/interface/school.types"
import Image from "next/image"
import { Clock, MapPin, Phone, Calendar, QrCode, Info } from "lucide-react"
import { formatDistance } from "date-fns"

interface ViewSchoolDetailsModalProps {
  school: School | null
  isOpen: boolean
  onClose: () => void
}

// Helper function to format ISO datetime to readable time
const formatTimeFromISO = (isoString?: string): string => {
  if (!isoString) return 'Not specified';
  
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return 'Invalid date format';
  }
};

// Helper function to format ISO date to readable date
const formatDateFromISO = (isoString?: string | Date): string => {
  if (!isoString) return 'Not specified';
  
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch {
    return 'Invalid date format';
  }
};

// Helper to get the time ago from a date
const getTimeAgo = (isoString?: string | Date): string => {
  if (!isoString) return '';
  
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return '';
    }
    return formatDistance(date, new Date(), { addSuffix: true });
  } catch {
    return '';
  }
};

const ViewSchoolDetailsModal = ({ school, isOpen, onClose }: ViewSchoolDetailsModalProps) => {
  if (!school) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            School Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Header with logo and name */}
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <div className="relative">
              <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                {school.logo_url ? (
                  <Image
                    src={school.logo_url}
                    alt={school.school_name}
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full bg-gray-100">
                    <Info className="h-10 w-10 text-gray-400" /> 
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-y-3">
              <h2 className="text-2xl font-bold text-center sm:text-left">{school.school_name}</h2>
              
              <div className="flex items-center text-sm text-gray-500 justify-center sm:justify-start">
                <Clock className="h-4 w-4 mr-2" />
                <span>
                  {school.start_time && school.end_time
                    ? `${formatTimeFromISO(school.start_time)} - ${formatTimeFromISO(school.end_time)}`
                    : 'Hours not specified'}
                </span>
              </div>
              
              {school.address && (
                <div className="flex items-center text-sm text-gray-500 justify-center sm:justify-start">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{school.address}</span>
                </div>
              )}
              
              {school.contact_number && (
                <div className="flex items-center text-sm text-gray-500 justify-center sm:justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{school.contact_number}</span>
                </div>
              )}
              
             
            </div>
          </div>

          {/* Description */}
          {school.description && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Description</h3>
              <p className="text-sm text-gray-700">{school.description}</p>
            </div>
          )}

          {/* QR Code */}
          {school.qr_url && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-600 mb-3 flex items-center">
                <QrCode className="h-4 w-4 mr-2" />
                School QR Code
              </h3>
              <div className="flex justify-center">
                <div className="w-48 h-48 p-2 border rounded-lg">
                  <Image
                    src={school.qr_url}
                    alt="School QR Code"
                    width={180}
                    height={180}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Technical Details */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Technical Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-gray-50 rounded">
                <div className="font-medium text-gray-500">School ID:</div>
                <div className="text-gray-700 break-all">{school._id}</div>
              </div>
              {school.updatedAt && (
                <div className="p-2 bg-gray-50 rounded">
                  <div className="font-medium text-gray-500">Last Updated:</div>
                  <div className="text-gray-700">{formatDateFromISO(school.updatedAt)}</div>
                  <div className="text-gray-500 text-xs">{getTimeAgo(school.updatedAt)}</div>
                </div>
              )}
            </div>
          </div>

          {/* Future fields - Placeholder for additional fields */}
          <div className="text-xs text-gray-400 border-t pt-4">
          <div className="flex items-center text-sm text-gray-500 mb-1 mt-2 justify-center sm:justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Created {formatDateFromISO(school.createdAt)} ({getTimeAgo(school.createdAt)})</span>
              </div>
            {/* <p>Additional school details will appear here as they become available.</p> */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ViewSchoolDetailsModal