import { InfoIcon } from 'lucide-react'
import React from 'react'

const PermissionBanner = ({isLoadingUser, isSuperAdmin, school_name, text}) => {
  return (
    <div>
        {!isLoadingUser && !isSuperAdmin && (
        <div className="bg-blue-50 text-blue-700 p-4 rounded-md flex items-center gap-2 text-sm">
          <InfoIcon className="h-5 w-5 flex-shrink-0" />
          <p> {text} <span className="font-bold">{school_name ?? 'N/A'}</span></p>
        </div>
      )}
    </div>
  )
}

export default PermissionBanner