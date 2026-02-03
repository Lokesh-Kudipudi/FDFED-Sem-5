import React from 'react';

export default function RoomTypeForm({ 
    typeForm, 
    setTypeField, 
    setFeaturesFromString, 
    handleFileChange, 
    handleTypeSubmit, 
    submittingType, 
    editingTypeId, 
    resetTypeForm, 
    imagePreview, 
    selectedFile 
}) {
  return (
    <form onSubmit={handleTypeSubmit} className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 sticky top-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">{editingTypeId ? "Edit Type" : "Add Room Type"}</h3>
        <div className="space-y-4">
            <input className="w-full border p-3 rounded-xl outline-none focus:ring-2 ring-[#003366]" placeholder="Title" value={typeForm.title} onChange={e=>setTypeField("title", e.target.value)} />
            <input className="w-full border p-3 rounded-xl outline-none focus:ring-2 ring-[#003366]" type="number" placeholder="Price" value={typeForm.price} onChange={e=>setTypeField("price", e.target.value)} />
            <textarea className="w-full border p-3 rounded-xl outline-none focus:ring-2 ring-[#003366]" placeholder="Description" rows="3" value={typeForm.description} onChange={e=>setTypeField("description", e.target.value)} />
            <input className="w-full border p-3 rounded-xl outline-none focus:ring-2 ring-[#003366]" placeholder="Features (comma separated)" value={(typeForm.features||[]).join(",")} onChange={e=>setFeaturesFromString(e.target.value)} />
            
            {/* Image Upload Simplified */}
                <div className="relative">
                <label className="block w-full border-2 border-dashed border-gray-300 p-4 rounded-xl text-center cursor-pointer hover:bg-gray-50">
                    <input type="file" className="hidden" onChange={handleFileChange} />
                    {selectedFile ? selectedFile.name : "Upload Image"}
                </label>
                {imagePreview && <img src={imagePreview} className="mt-2 h-32 w-full object-cover rounded-xl" alt="Preview"/>}
            </div>

            <div className="flex gap-2">
                    <button type="submit" disabled={submittingType} className="flex-1 bg-[#003366] text-white py-3 rounded-xl font-bold hover:bg-blue-900 transition-all">{submittingType ? "Saving..." : "Save Type"}</button>
                    {editingTypeId && <button type="button" onClick={resetTypeForm} className="px-4 bg-gray-200 rounded-xl font-bold text-gray-600">Cancel</button>}
            </div>
        </div>
    </form>
  );
}
