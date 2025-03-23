"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Save } from "lucide-react";
import React, { useState } from "react";

const SchoolDetails = () => {
  const [schoolName, setSchoolName] = useState("");
  const [schoolAddress, setSchoolAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [description, setDescription] = useState("");

  const handleSaveSettings = () => {
    console.log("School Settings:", {
      schoolName,
      schoolAddress,
      contactNumber,
      description,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">School Details</h2>
        <Button
            onClick={handleSaveSettings} 
            disabled={!schoolName || !schoolAddress || !contactNumber}
        >
            <Save className="h-4 w-4 mr-2" />
            Save Settings
        </Button>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-muted-foreground">School Name</Label>
          <Input
            id="schoolName"
            placeholder="Type School Name here..."
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground">School Address</Label>
          <Input
            id="schoolAddress"
            placeholder="Type School Address here..."
            value={schoolAddress}
            onChange={(e) => setSchoolAddress(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground">Contact Number</Label>
          <Input
            id="contactNumber"
            placeholder="Type School Contact Number here..."
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground">
            Additional Description (Optional)
          </Label>
          <Textarea
            id="description"
            placeholder="Type additional description here..."
            className="min-h-[120px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground">Start Time</Label>
            <Button variant="outline" className="w-full justify-start">
              <Clock className="mr-2 h-4 w-4" />
              <span className="text-muted-foreground">Select Time</span>
            </Button>
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground">End Time</Label>
            <Button variant="outline" className="w-full justify-start">
              <Clock className="mr-2 h-4 w-4" />
              <span className="text-muted-foreground">Select Time</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolDetails;
