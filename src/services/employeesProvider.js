import { toast } from "react-toastify";
import supabase from "./supabase";
export async function getEmployees() {   
  let { data: employees, error } = await supabase     
    .from("Users")     
    .select("*")     
    .neq("role", "candidate");  
    
  if (error) throw new Error(error.message);   

  console.log(employees);   
  const returnData = [];   
  
  for (let e of employees) {     
    let { data: fileData, error: statError } = await supabase.storage       
      .from("avatars")       
      .list("", { search: `${e.id}` });     
    
    console.log(fileData);     
    
    if (statError || fileData.length === 0) {       
      returnData.push({ ...e, image: null });     
    } else {       
      const { data: imageData } = await supabase.storage         
        .from("avatars")         
        .getPublicUrl(`${e.id}.png`);       
      
      const imageUrl = `${imageData.publicUrl}?t=${Date.now()}`;       
      returnData.push({ ...e, image: imageUrl });     
    }   
  }   
  
  console.log(returnData);   
  return returnData; 
}

export async function getCandidates() {   
  let { data: candidates, error } = await supabase     
    .from("Users")     
    .select("*")     
    .eq("role", "candidate");  
    
  if (error) throw new Error(error.message);   

  console.log(candidates);   
  const returnData = [];   
  
  for (let c of candidates) {     
    let { data: fileData, error: statError } = await supabase.storage       
      .from("avatars")       
      .list("", { search: `${c.id}` });     
    
    console.log(fileData);     
    
    if (statError || fileData.length === 0) {       
      returnData.push({ ...c, image: null });     
    } else {       
      const { data: imageData } = await supabase.storage         
        .from("avatars")         
        .getPublicUrl(`${c.id}.png`);       
      
      const imageUrl = `${imageData.publicUrl}?t=${Date.now()}`;       
      returnData.push({ ...c, image: imageUrl });     
    }   
  }   
  
  console.log(returnData);   
  return returnData; 
}

export async function updateEmployee(employeeData) {
  // Extract ID and remove it from the data to be updated
  const { id, ...updateData } = employeeData;
  
  // Update the employee in the database
  let { data: updatedEmployee, error: updateError } = await supabase
    .from("Users")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();
  
  if (updateError) throw new Error(updateError.message);
  
  // Verify the update was successful
  if (!updatedEmployee) throw new Error("Employee not found or update failed");
  
  console.log("Employee updated:", updatedEmployee);
  
  // Return the updated employee with their image if available
  let { data: fileData, error: storageError } = await supabase.storage
    .from("avatars")
    .list("", { search: `${id}` });
  
  if (storageError || fileData.length === 0) {
    return { ...updatedEmployee, image: null };
  } else {
    const { data: imageData } = await supabase.storage
      .from("avatars")
      .getPublicUrl(`${id}.png`);
    
    const imageUrl = `${imageData.publicUrl}?t=${Date.now()}`;
    return { ...updatedEmployee, image: imageUrl };
  }
}

export async function promoteToEmployee(userId, department, salary) {
  // Update the user's role from "candidate" to "employee" and set department and salary
  let { data: updatedUser, error: updateError } = await supabase
    .from("Users")
    .update({ 
      role: "employee",
      department: department,
      salary: salary,
      hireDate: new Date().toISOString().split('T')[0], // Set hire date to today
      status: "Probation" // New employees start on probation
    })
    .eq("id", userId)
    .select()
    .single();
  
  if (updateError) throw new Error(updateError.message);
  
  // Verify the update was successful
  if (!updatedUser) throw new Error("User not found or update failed");
  
  console.log("User promoted:", updatedUser);
  
  // Return the updated user with their image if available
  let { data: fileData, error: storageError } = await supabase.storage
    .from("avatars")
    .list("", { search: `${userId}` });
  
  console.log(fileData);
  
  if (storageError || fileData.length === 0) {
    return { ...updatedUser, image: null };
  } else {
    const { data: imageData } = await supabase.storage
      .from("avatars")
      .getPublicUrl(`${userId}.png`);
    
    const imageUrl = `${imageData.publicUrl}?t=${Date.now()}`;
    return { ...updatedUser, image: imageUrl };
  }
}

export async function deleteEmployee(employeeId) {
  // First check if employee exists
  let { data: employee, error: fetchError } = await supabase
    .from("Users")
    .select("*")
    .eq("id", employeeId)
    .single();
  
  if (fetchError) throw new Error(fetchError.message);
  if (!employee) throw new Error("Employee not found");
  
  // Delete the employee from the database
  let { error: deleteError } = await supabase
    .from("Users")
    .delete()
    .eq("id", employeeId);
  
  if (deleteError) throw new Error(deleteError.message);
  
  // Check if employee has an avatar and delete it from storage if it exists
  let { data: fileData, error: storageError } = await supabase.storage
    .from("avatars")
    .list("", { search: `${employeeId}` });
  
  if (!storageError && fileData.length > 0) {
    // Delete avatar file
    let { error: deleteFileError } = await supabase.storage
      .from("avatars")
      .remove([`${employeeId}.png`]);
    
    if (deleteFileError) {
      console.error("Failed to delete avatar:", deleteFileError);
      // Continue with the deletion process even if avatar deletion fails
    }
  }
  
  console.log("Employee deleted:", employeeId);
  
  return { success: true, message: "Employee deleted successfully" };
}