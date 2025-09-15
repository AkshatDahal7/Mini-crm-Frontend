import React, { useState } from "react";

const defaultRule = { field: "minSpend", op: ">", value: 10000 };
const ruleFields = [
  { label: "Min Spend", value: "minSpend" },
  { label: "Max Spend", value: "maxSpend" },
  { label: "Min Visits", value: "minVisits" },
  { label: "Inactive Days", value: "inactiveDays" }
];
const ruleOps = [">", "<", ">=", "<=", "=="];

const CreateSegment = ({ onCreate, customers = [] }) => {
  const [segment, setSegment] = useState({ name: "", description: "", rules: [], logic: "AND" });
  const [rules, setRules] = useState([defaultRule]);
  const [logic, setLogic] = useState("AND");
  const [audienceSize, setAudienceSize] = useState(null);
  const [previewing, setPreviewing] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRuleChange = (idx, key, value) => {
    const updated = rules.map((r, i) => i === idx ? { ...r, [key]: value } : r);
    setRules(updated);
    // Clear any previous errors when user makes changes
    setError("");
  };

  const addRule = () => {
    setRules([...rules, { ...defaultRule }]);
    setError("");
  };

  const removeRule = idx => {
    if (rules.length > 1) {
      setRules(rules.filter((_, i) => i !== idx));
      setError("");
    }
  };

  const validateRules = () => {
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      if (!rule.field || !rule.op || rule.value === undefined || rule.value === null || rule.value === "") {
        setError(`Rule ${i + 1} is incomplete. Please fill all fields.`);
        return false;
      }
      if (isNaN(rule.value)) {
        setError(`Rule ${i + 1} value must be a valid number.`);
        return false;
      }
    }
    return true;
  };

  const handlePreview = async () => {
    if (!validateRules()) return;
    
    setPreviewing(true);
    setError("");
    
    try {
      // Use customers passed as props from Dashboard
      if (!customers || customers.length === 0) {
        setError("No customer data available for preview.");
        setAudienceSize(0);
        return;
      }

      let filtered = customers;
      
      // Apply rules based on logic (AND/OR)
      if (logic === "AND") {
        rules.forEach(rule => {
          filtered = filtered.filter(cust => evaluateRule(cust, rule));
        });
      } else { // OR logic
        filtered = customers.filter(cust => 
          rules.some(rule => evaluateRule(cust, rule))
        );
      }
      
      setAudienceSize(filtered.length);
    } catch (err) {
      setError("Failed to preview audience. Please try again.");
      console.error("Preview error:", err);
    } finally {
      setPreviewing(false);
    }
  };

  const evaluateRule = (customer, rule) => {
    let val;
    
    if (rule.field === "inactiveDays") {
      val = customer.lastActive 
        ? (Date.now() - new Date(customer.lastActive)) / (1000*60*60*24) 
        : 9999;
    } else {
      val = customer[rule.field];
    }

    // Handle undefined/null values
    if (val === undefined || val === null) {
      return false;
    }

    const ruleValue = Number(rule.value);
    const customerValue = Number(val);

    switch (rule.op) {
      case ">": return customerValue > ruleValue;
      case "<": return customerValue < ruleValue;
      case ">=": return customerValue >= ruleValue;
      case "<=": return customerValue <= ruleValue;
      case "==": return customerValue === ruleValue;
      default: return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validate form
    if (!segment.name.trim()) {
      setError("Segment name is required.");
      return;
    }
    
    if (!validateRules()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Ensure we have the required fields for the backend
      const segmentData = {
        name: segment.name.trim(),
        description: segment.description.trim(),
        rules: rules.map(rule => ({
          field: rule.field,
          op: rule.op,
          value: Number(rule.value) // Ensure value is a number
        })),
        logic: logic
      };

      console.log("Submitting segment data:", segmentData);
      
      await onCreate(segmentData);
      
      // Reset form on success
      setSegment({ name: "", description: "", rules: [], logic: "AND" });
      setRules([{ ...defaultRule }]);
      setLogic("AND");
      setAudienceSize(null);
      
    } catch (err) {
      console.error("Segment creation error:", err);
      setError(err.message || "Failed to create segment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ 
        background: '#f9f9f9', 
        padding: '18px', 
        borderRadius: '8px', 
        marginBottom: '18px' 
      }}>
        <h3>Create Segment</h3>
        
        {error && (
          <div style={{ 
            background: '#fee', 
            color: '#c53030', 
            padding: '8px', 
            borderRadius: '4px', 
            marginBottom: '12px',
            border: '1px solid #feb2b2'
          }}>
            {error}
          </div>
        )}

        <input 
          placeholder="Segment Name (required)" 
          value={segment.name} 
          onChange={e => setSegment({...segment, name: e.target.value})} 
          style={{ 
            marginBottom: '8px', 
            width: '100%', 
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }} 
          required
        />
        
        <input 
          placeholder="Description (optional)" 
          value={segment.description} 
          onChange={e => setSegment({...segment, description: e.target.value})} 
          style={{ 
            marginBottom: '8px', 
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }} 
        />
        
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontWeight: 'bold', marginRight: '8px' }}>Logic: </label>
          <select 
            value={logic} 
            onChange={e => setLogic(e.target.value)}
            style={{ padding: '4px', borderRadius: '4px' }}
          >
            <option value="AND">AND (all rules must match)</option>
            <option value="OR">OR (any rule can match)</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '12px' }}>
          <strong>Rules:</strong>
          {rules.map((rule, idx) => (
            <div key={idx} style={{ 
              display: 'flex', 
              gap: '8px', 
              alignItems: 'center', 
              marginBottom: '8px',
              padding: '8px',
              background: 'white',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}>
              <select 
                value={rule.field} 
                onChange={e => handleRuleChange(idx, 'field', e.target.value)}
                style={{ padding: '4px', borderRadius: '4px' }}
              >
                {ruleFields.map(f => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
              
              <select 
                value={rule.op} 
                onChange={e => handleRuleChange(idx, 'op', e.target.value)}
                style={{ padding: '4px', borderRadius: '4px' }}
              >
                {ruleOps.map(op => (
                  <option key={op} value={op}>{op}</option>
                ))}
              </select>
              
              <input 
                type="number" 
                value={rule.value} 
                onChange={e => handleRuleChange(idx, 'value', e.target.value)} 
                style={{ 
                  width: '100px',
                  padding: '4px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
                required
              />
              
              <button 
                type="button" 
                onClick={() => removeRule(idx)} 
                disabled={rules.length <= 1}
                style={{ 
                  color: rules.length <= 1 ? '#ccc' : 'red', 
                  border: 'none', 
                  background: 'none', 
                  cursor: rules.length <= 1 ? 'not-allowed' : 'pointer',
                  fontSize: '16px'
                }}
                title={rules.length <= 1 ? "At least one rule is required" : "Remove rule"}
              >
                ✕
              </button>
            </div>
          ))}
          
          <button 
            type="button" 
            onClick={addRule} 
            style={{ 
              marginTop: '8px', 
              background: '#4f46e5', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              padding: '8px 16px', 
              cursor: 'pointer'
            }}
          >
            + Add Rule
          </button>
        </div>
        
        <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            type="button" 
            onClick={handlePreview} 
            disabled={previewing || !rules.length}
            style={{ 
              background: previewing ? '#ccc' : '#059669', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              padding: '8px 16px', 
              cursor: previewing ? 'not-allowed' : 'pointer'
            }}
          >
            {previewing ? 'Previewing...' : 'Preview Audience'}
          </button>
          
          {audienceSize !== null && (
            <span style={{ color: '#059669', fontWeight: 'bold' }}>
              Audience Size: {audienceSize.toLocaleString()} customers
            </span>
          )}
        </div>
        
        <button 
          type="submit" 
          onClick={handleSubmit}
          disabled={isSubmitting || !segment.name.trim()}
          style={{ 
            background: (isSubmitting || !segment.name.trim()) ? '#ccc' : '#4f46e5', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            padding: '12px 24px', 
            cursor: (isSubmitting || !segment.name.trim()) ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {isSubmitting ? 'Creating Segment...' : 'Create Segment'}
        </button>
      </div>
    </div>
  );
};

export default CreateSegment;