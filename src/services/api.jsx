// Send campaign to segment
export const sendCampaign = async (campaignData) => {
  try {
    const data = await apiRequest("/campaigns/send", {
      method: "POST",
      body: JSON.stringify(campaignData),
    });
    return data;
  } catch (error) {
    console.error("Failed to send campaign:", error);
    throw error;
  }
};
// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const data = await apiRequest(`/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return data;
  } catch (error) {
    console.error("Failed to update order status:", error);
    throw error;
  }
};
const API_BASE = "https://mini-crm-eg7w.onrender.com/api";

// Helper to get token
const getToken = () => {
  const token = localStorage.getItem("token");
  console.log("Token retrieved:", token ? "Token exists" : "No token found");
  return token;
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  console.log(`Making API request to: ${API_BASE}${endpoint}`, config);

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    
    console.log(`API Response for ${endpoint}:`, {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || `HTTP error! status: ${response.status}`;
        console.error(`API Error for ${endpoint}:`, errorData);
      } catch (parseError) {
        errorMessage = `HTTP error! status: ${response.status}`;
        console.error(`Failed to parse error response for ${endpoint}:`, parseError);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log(`API Success for ${endpoint}:`, data);
    
    return data;
  } catch (error) {
    console.error(`API Request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Customers
export const fetchCustomers = async () => {
  try {
    const data = await apiRequest("/customers");
    
    // Handle different response formats
    if (Array.isArray(data)) {
      console.log("Customers data is array:", data);
      return data;
    } else if (data && Array.isArray(data.customers)) {
      console.log("Customers data wrapped in object:", data.customers);
      return data.customers;
    } else if (data && Array.isArray(data.data)) {
      console.log("Customers data in data property:", data.data);
      return data.data;
    } else {
      console.warn("Unexpected customers response format:", data);
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    // Return empty array instead of throwing to prevent app crash
    return [];
  }
};

export const createCustomer = async (customerData) => {
  try {
    console.log("Creating customer with data:", customerData);
    const data = await apiRequest("/customers", {
      method: "POST",
      body: JSON.stringify(customerData),
    });
    
    // Handle different response formats
    if (data && data.customer) {
      return data.customer;
    } else if (data && data.data) {
      return data.data;
    }
    return data;
  } catch (error) {
    console.error("Failed to create customer:", error);
    throw error;
  }
};

// Orders
export const fetchOrders = async () => {
  try {
    const data = await apiRequest("/orders");
    
    // Handle different response formats
    if (Array.isArray(data)) {
      console.log("Orders data is array:", data);
      return data;
    } else if (data && Array.isArray(data.orders)) {
      console.log("Orders data wrapped in object:", data.orders);
      return data.orders;
    } else if (data && Array.isArray(data.data)) {
      console.log("Orders data in data property:", data.data);
      return data.data;
    } else {
      console.warn("Unexpected orders response format:", data);
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }
};

export const createOrder = async (orderData) => {
  try {
    console.log("Creating order with data:", orderData);
    const data = await apiRequest("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
    
    // Handle different response formats
    if (data && data.order) {
      return data.order;
    } else if (data && data.data) {
      return data.data;
    }
    return data;
  } catch (error) {
    console.error("Failed to create order:", error);
    throw error;
  }
};

// Segments
export const fetchSegments = async () => {
  try {
    const data = await apiRequest("/segments", {
      method: "GET",
    });

    // Standardize response to always return an array
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.segments)) return data.segments;
    if (data && Array.isArray(data.data)) return data.data;

    console.warn("Unexpected segments response format:", data);
    return [];
  } catch (error) {
    console.error("Failed to fetch segments:", error.message);
    return [];
  }
};

// Create a new segment
export const createSegment = async (segmentData) => {
  try {
    const data = await apiRequest("/segments", {
      method: "POST",
      body: JSON.stringify(segmentData),
    });

    // Standardize return to always return segment object
    if (data && data.segment) return data.segment;
    if (data && data.data) return data.data;

    return data;
  } catch (error) {
    console.error("Failed to create segment:", error.message);
    throw error;
  }
};

// Campaigns
export const fetchCampaigns = async () => {
  try {
    const data = await apiRequest("/campaigns");
    
    // Handle different response formats
    if (Array.isArray(data)) {
      console.log("Campaigns data is array:", data);
      return data;
    } else if (data && Array.isArray(data.campaigns)) {
      console.log("Campaigns data wrapped in object:", data.campaigns);
      return data.campaigns;
    } else if (data && Array.isArray(data.data)) {
      console.log("Campaigns data in data property:", data.data);
      return data.data;
    } else {
      console.warn("Unexpected campaigns response format:", data);
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch campaigns:", error);
    return [];
  }
};

export const createCampaign = async (campaignData) => {
  try {
    console.log("Creating campaign with data:", campaignData);
    const data = await apiRequest("/campaigns", {
      method: "POST",
      body: JSON.stringify(campaignData),
    });
    
    // Handle different response formats
    if (data && data.campaign) {
      return data.campaign;
    } else if (data && data.data) {
      return data.data;
    }
    return data;
  } catch (error) {
    console.error("Failed to create campaign:", error);
    throw error;
  }
};

// Utility function to test API connection
export const testApiConnection = async () => {
  try {
    const response = await fetch(`${API_BASE}/health`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return {
      connected: response.ok,
      status: response.status,
      message: response.ok ? "API connected successfully" : "API connection failed"
    };
  } catch (error) {
    return {
      connected: false,
      status: 0,
      message: `API connection error: ${error.message}`
    };
  }
};