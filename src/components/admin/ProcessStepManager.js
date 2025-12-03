"use client";
import { useState, useEffect } from 'react';
import { PlusCircleIcon, Edit3Icon, Trash2Icon, ArrowUpIcon, ArrowDownIcon, GripVerticalIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { 
    createHomepageProcessStep,
    updateHomepageProcessStep,
    deleteHomepageProcessStep,
    getHomepageProcessSteps // To re-fetch and re-order if needed
} from '@/lib/api';

// Modal Component (Simplified)
const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ProcessStepForm Component
const ProcessStepForm = ({ initialData, onSave, onCancel, isSubmitting }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stepNumber, setStepNumber] = useState(1); // Default or derive from existing steps count
  const [iconName, setIconName] = useState(''); // Optional

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setStepNumber(initialData.step_number || 1);
      setIconName(initialData.icon_name || '');
    } else {
        // Reset for new form
        setTitle('');
        setDescription('');
        // Step number might be better set by parent based on current steps length + 1
        setStepNumber(1); 
        setIconName('');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error('Title and Description are required.');
      return;
    }
    onSave({ 
        title,
        description,
        step_number: parseInt(stepNumber, 10),
        icon_name: iconName.trim() || null // Send null if empty
    });
  };

  const inputClass = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="step_number" className={labelClass}>Step Number</label>
        <input 
          type="number" 
          name="step_number" 
          id="step_number" 
          value={stepNumber} 
          onChange={(e) => setStepNumber(parseInt(e.target.value, 10) || 1)} 
          className={inputClass} 
          min="1"
        />
      </div>
      <div>
        <label htmlFor="title" className={labelClass}>Title</label>
        <input 
          type="text" 
          name="title" 
          id="title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          className={inputClass} 
          required 
        />
      </div>
      <div>
        <label htmlFor="description" className={labelClass}>Description</label>
        <textarea 
          name="description" 
          id="description" 
          rows="4" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          className={inputClass} 
          required
        ></textarea>
      </div>
      <div>
        <label htmlFor="icon_name" className={labelClass}>Icon Name (Optional, e.g., &apos;award&apos;)</label>
        <input 
          type="text" 
          name="icon_name" 
          id="icon_name" 
          value={iconName} 
          onChange={(e) => setIconName(e.target.value)} 
          className={inputClass} 
          placeholder="e.g., check-circle, award, lightbulb"
        />
        <p className="text-xs text-gray-500 mt-1">Refer to a list of available icon names or leave blank.</p>
      </div>
      <div className="flex justify-end space-x-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary">
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-brand-primary border border-transparent rounded-md shadow-sm hover:bg-brand-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Step'}
        </button>
      </div>
    </form>
  );
};

// Main ProcessStepManager Component
export default function ProcessStepManager({ initialSteps, setProcessStepsOnPage }) {
  const [steps, setSteps] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setSteps(initialSteps ? [...initialSteps].sort((a, b) => a.step_number - b.step_number) : []);
  }, [initialSteps]);

  const fetchAndUpdateSteps = async () => {
    const response = await getHomepageProcessSteps();
    if (response.success) {
      const sortedSteps = [...response.data].sort((a,b) => a.step_number - b.step_number);
      setSteps(sortedSteps);
      if (setProcessStepsOnPage) setProcessStepsOnPage(sortedSteps); // Update parent page state
    } else {
      toast.error('Failed to refresh process steps: ' + response.error);
    }
  };

  const openModalForNew = () => {
    setEditingStep(null); // Clear any editing state
    setIsModalOpen(true);
  };

  const openModalForEdit = (step) => {
    setEditingStep(step);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStep(null);
  };

  const handleSaveStep = async (stepData) => {
    setIsSubmitting(true);
    let response;
    if (editingStep && editingStep.id) {
      // Update existing step
      response = await updateHomepageProcessStep(editingStep.id, stepData);
      if (response.success) {
        toast.success('Process step updated successfully!');
      } else {
        toast.error('Failed to update step: ' + response.error);
      }
    } else {
      // Create new step - adjust step_number if needed to avoid duplicates, or let DB handle uniqueness if constrained
      // For now, form collects step_number. Backend should ensure order or re-order if needed.
      response = await createHomepageProcessStep(stepData);
      if (response.success) {
        toast.success('Process step created successfully!');
      } else {
        toast.error('Failed to create step: ' + response.error);
      }
    }
    if (response.success) {
      await fetchAndUpdateSteps(); // Refetch all steps to ensure correct order and get new data
      closeModal();
    }
    setIsSubmitting(false);
  };

  const handleDeleteStep = async (stepId) => {
    if (window.confirm('Are you sure you want to delete this process step?')) {
      setIsSubmitting(true);
      const response = await deleteHomepageProcessStep(stepId);
      if (response.success) {
        toast.success('Process step deleted successfully!');
        await fetchAndUpdateSteps();
      } else {
        toast.error('Failed to delete step: ' + response.error);
      }
      setIsSubmitting(false);
    }
  };

  // Basic reordering: Swap step_number with adjacent and update both
  // More advanced reordering (drag-and-drop) is complex and out of scope for this initial setup.
  const handleMoveStep = async (index, direction) => {
    const newSteps = [...steps];
    const stepToMove = newSteps[index];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;

    if (swapIndex < 0 || swapIndex >= newSteps.length) return; // Boundary check

    const stepToSwapWith = newSteps[swapIndex];

    // Swap step_number values
    const tempStepNumber = stepToMove.step_number;
    stepToMove.step_number = stepToSwapWith.step_number;
    stepToSwapWith.step_number = tempStepNumber;
    
    setIsSubmitting(true);
    try {
        // Update both steps in the database
        const update1 = updateHomepageProcessStep(stepToMove.id, { step_number: stepToMove.step_number });
        const update2 = updateHomepageProcessStep(stepToSwapWith.id, { step_number: stepToSwapWith.step_number });
        
        const [res1, res2] = await Promise.all([update1, update2]);

        if (res1.success && res2.success) {
            toast.success('Step reordered successfully.');
            // Update local state immediately for responsiveness, then refetch for consistency
            newSteps[index] = stepToSwapWith; // Items are swapped in UI
            newSteps[swapIndex] = stepToMove;
            setSteps(newSteps.sort((a,b) => a.step_number - b.step_number));
            if (setProcessStepsOnPage) setProcessStepsOnPage(newSteps.sort((a,b) => a.step_number - b.step_number));
            await fetchAndUpdateSteps(); // Final consistency check
        } else {
            throw new Error(res1.error || res2.error || 'Failed to reorder steps.');
        }
    } catch (error) {
        toast.error(`Error reordering steps: ${error.message}`);
        // Revert local changes if DB update fails - might need a more robust rollback
        await fetchAndUpdateSteps(); 
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">Manage Process Steps</h3>
        <button 
          onClick={openModalForNew} 
          className="bg-brand-secondary hover:bg-yellow-500 text-brand-primary font-semibold py-2 px-4 rounded-lg flex items-center transition-colors shadow-sm"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" /> Add New Step
        </button>
      </div>

      {steps.length === 0 && !isSubmitting ? (
        <p className="text-gray-600"></p>
      ) : (
        <ul className="space-y-3">
          {steps.map((step, index) => (
            <li key={step.id} className="bg-white p-4 rounded-lg shadow flex items-start justify-between">
              <div className="flex-grow pr-4">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-brand-secondary text-white text-xs font-bold mr-3">
                  {step.step_number}
                </span>
                <strong className="text-brand-primary-dark">{step.title}</strong>
                <p className="text-sm text-gray-600 mt-1 ml-9 break-words">{step.description}</p>
                {step.icon_name && <p className="text-xs text-gray-500 mt-1 ml-9 break-words">Icon: {step.icon_name}</p>}
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                <button 
                    onClick={() => handleMoveStep(index, 'up')}
                    disabled={index === 0 || isSubmitting}
                    className="p-1.5 text-gray-500 hover:text-brand-primary disabled:opacity-30 disabled:hover:text-gray-500 rounded-md hover:bg-gray-100 transition-colors"
                    title="Move Up"
                >
                    <ArrowUpIcon className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => handleMoveStep(index, 'down')}
                    disabled={index === steps.length - 1 || isSubmitting}
                    className="p-1.5 text-gray-500 hover:text-brand-primary disabled:opacity-30 disabled:hover:text-gray-500 rounded-md hover:bg-gray-100 transition-colors"
                    title="Move Down"
                >
                    <ArrowDownIcon className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => openModalForEdit(step)} 
                  disabled={isSubmitting}
                  className="p-1.5 text-blue-600 hover:text-blue-800 disabled:opacity-50 rounded-md hover:bg-blue-50 transition-colors"
                  title="Edit Step"
                >
                  <Edit3Icon className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteStep(step.id)} 
                  disabled={isSubmitting}
                  className="p-1.5 text-red-600 hover:text-red-800 disabled:opacity-50 rounded-md hover:bg-red-50 transition-colors"
                  title="Delete Step"
                >
                  <Trash2Icon className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
       {steps.length === 0 && !isSubmitting && (
            <div className="text-center py-8 px-4 border-2 border-dashed border-gray-200 rounded-lg">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No process steps yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding your first process step.</p>
                <div className="mt-6">
                    <button
                        type="button"
                        onClick={openModalForNew}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
                    >
                        <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Add New Process Step
                    </button>
                </div>
            </div>
        )}

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingStep ? 'Edit Process Step' : 'Add New Process Step'}>
        <ProcessStepForm 
          initialData={editingStep}
          onSave={handleSaveStep} 
          onCancel={closeModal} 
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
} 