// Google Apps Script để xử lý requests từ React App - FIXED VERSION
// Copy code này vào Google Apps Script và deploy as web app

function doOptions(e) {
  const output = ContentService.createTextOutput('');
  output.setMimeType(ContentService.MimeType.TEXT);
  
  // Set CORS headers individually to avoid chaining issues
  output.setHeader('Access-Control-Allow-Origin', '*');
  output.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  output.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  output.setHeader('Access-Control-Max-Age', '3600');
  
  return output;
}

function doPost(e) {
  try {
    Logger.log('POST request received');
    
    let data;
    
    // Handle both JSON data (from fetch) and form data (from form submission)
    if (e.postData && e.postData.contents) {
      try {
        // Try to parse as JSON first
        data = JSON.parse(e.postData.contents);
        Logger.log('Parsed JSON data: ' + JSON.stringify(data));
      } catch (jsonError) {
        Logger.log('Not JSON data, using form parameters');
        // If JSON parsing fails, use form parameters
        data = e.parameter;
        Logger.log('Form data: ' + JSON.stringify(data));
      }
    } else {
      // Use form parameters
      data = e.parameter;
      Logger.log('Using form parameters: ' + JSON.stringify(data));
    }
    
    // Validate required data
    if (!data.type || !data.name || !data.phone) {
      throw new Error('Missing required fields: type, name, or phone');
    }
    
    // Get the active spreadsheet
    const spreadsheetId = '1k6FC5cA7aZMtxfMK5347VW8PkJN7tS5pAKRmwrIulKo';
    Logger.log('Opening spreadsheet: ' + spreadsheetId);
    
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    Logger.log('Spreadsheet opened successfully');
    
    // Get the appropriate sheet based on form type
    let sheet;
    if (data.type === 'confirm') {
      sheet = spreadsheet.getSheetByName('Xác nhận tham gia') || spreadsheet.insertSheet('Xác nhận tham gia');
      Logger.log('Using confirmation sheet');
    } else if (data.type === 'suggest') {
      sheet = spreadsheet.getSheetByName('Góp ý thời gian') || spreadsheet.insertSheet('Góp ý thời gian');
      Logger.log('Using suggestion sheet');
    } else {
      throw new Error('Invalid form type: ' + data.type);
    }
    
    // Prepare data for insertion
    const rowData = prepareRowData(data);
    Logger.log('Row data prepared: ' + JSON.stringify(rowData));
    
    // Insert data into sheet
    sheet.appendRow(rowData);
    Logger.log('Data inserted successfully');
    
    // Create response with CORS headers - Set headers separately to avoid chaining issues
    const responseText = JSON.stringify({ 
      'result': 'success', 
      'message': 'Data saved successfully' 
    });
    
    const output = ContentService.createTextOutput(responseText);
    output.setMimeType(ContentService.MimeType.JSON);
    output.setHeader('Access-Control-Allow-Origin', '*');
    output.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    output.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    return output;
      
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    Logger.log('Error stack: ' + error.stack);
    
    // Create error response with CORS headers
    const errorText = JSON.stringify({ 
      'result': 'error', 
      'error': error.toString() 
    });
    
    const output = ContentService.createTextOutput(errorText);
    output.setMimeType(ContentService.MimeType.JSON);
    output.setHeader('Access-Control-Allow-Origin', '*');
    output.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    output.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    return output;
  }
}

function doGet(e) {
  try {
    Logger.log('GET request received');
    Logger.log('Parameters: ' + JSON.stringify(e.parameter));
    
    // Create response with CORS headers
    const output = ContentService.createTextOutput('React-Google Sheets integration is working!');
    output.setMimeType(ContentService.MimeType.TEXT);
    output.setHeader('Access-Control-Allow-Origin', '*');
    output.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    output.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    return output;
      
  } catch (error) {
    Logger.log('Error in doGet: ' + error.toString());
    
    const output = ContentService.createTextOutput('Error: ' + error.toString());
    output.setMimeType(ContentService.MimeType.TEXT);
    output.setHeader('Access-Control-Allow-Origin', '*');
    
    return output;
  }
}

function prepareRowData(data) {
  try {
    Logger.log('Preparing row data for type: ' + data.type);
    
    const timestamp = new Date(data.timestamp);
    const formattedDate = Utilities.formatDate(timestamp, 'Asia/Ho_Chi_Minh', 'dd/MM/yyyy HH:mm:ss');
    Logger.log('Formatted date: ' + formattedDate);
    
    if (data.type === 'confirm') {
      const rowData = [
        formattedDate,           // Thời gian gửi
        data.name || '',         // Họ và tên
        data.phone || '',        // Số điện thoại
        data.email || '',        // Email
        data.message || ''       // Lời nhắn
      ];
      Logger.log('Confirmation row data: ' + JSON.stringify(rowData));
      return rowData;
    } else if (data.type === 'suggest') {
      const rowData = [
        formattedDate,           // Thời gian gửi
        data.name || '',         // Họ và tên
        data.phone || '',        // Số điện thoại
        data.suggestedDate || '', // Ngày đề xuất
        data.duration || '',     // Thời gian đi
        data.activities || '',   // Hoạt động mong muốn
        data.budget || ''        // Ngân sách dự kiến
      ];
      Logger.log('Suggestion row data: ' + JSON.stringify(rowData));
      return rowData;
    }
    
    Logger.log('Unknown data type, returning empty array');
    return [];
  } catch (error) {
    Logger.log('Error in prepareRowData: ' + error.toString());
    throw error;
  }
}

// Function to set up headers for the sheets
function setupSheetHeaders() {
  try {
    Logger.log('Setting up sheet headers');
    
    const spreadsheetId = '1k6FC5cA7aZMtxfMK5347VW8PkJN7tS5pAKRmwrIulKo';
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    Logger.log('Spreadsheet opened for header setup');
    
    // Setup headers for confirmation sheet
    let confirmSheet = spreadsheet.getSheetByName('Xác nhận tham gia');
    if (!confirmSheet) {
      confirmSheet = spreadsheet.insertSheet('Xác nhận tham gia');
      Logger.log('Created confirmation sheet');
    } else {
      Logger.log('Found existing confirmation sheet');
    }
    
    const confirmHeaders = [
      'Thời gian gửi',
      'Họ và tên',
      'Số điện thoại',
      'Email',
      'Lời nhắn'
    ];
    
    confirmSheet.getRange(1, 1, 1, confirmHeaders.length).setValues([confirmHeaders]);
    confirmSheet.getRange(1, 1, 1, confirmHeaders.length).setFontWeight('bold');
    confirmSheet.getRange(1, 1, 1, confirmHeaders.length).setBackground('#667eea');
    confirmSheet.getRange(1, 1, 1, confirmHeaders.length).setFontColor('white');
    Logger.log('Confirmation headers set up');
    
    // Setup headers for suggestion sheet
    let suggestSheet = spreadsheet.getSheetByName('Góp ý thời gian');
    if (!suggestSheet) {
      suggestSheet = spreadsheet.insertSheet('Góp ý thời gian');
      Logger.log('Created suggestion sheet');
    } else {
      Logger.log('Found existing suggestion sheet');
    }
    
    const suggestHeaders = [
      'Thời gian gửi',
      'Họ và tên',
      'Số điện thoại',
      'Ngày đề xuất',
      'Thời gian đi',
      'Hoạt động mong muốn',
      'Ngân sách dự kiến'
    ];
    
    suggestSheet.getRange(1, 1, 1, suggestHeaders.length).setValues([suggestHeaders]);
    suggestSheet.getRange(1, 1, 1, suggestHeaders.length).setFontWeight('bold');
    suggestSheet.getRange(1, 1, 1, suggestHeaders.length).setBackground('#667eea');
    suggestSheet.getRange(1, 1, 1, suggestHeaders.length).setFontColor('white');
    Logger.log('Suggestion headers set up');
    
    // Auto-resize columns
    confirmSheet.autoResizeColumns(1, confirmHeaders.length);
    suggestSheet.autoResizeColumns(1, suggestHeaders.length);
    Logger.log('Columns auto-resized');
    
    Logger.log('Sheet headers setup completed successfully');
  } catch (error) {
    Logger.log('Error in setupSheetHeaders: ' + error.toString());
    throw error;
  }
}

// Function to test the setup
function testSetup() {
  setupSheetHeaders();
  Logger.log('Sheet headers have been set up successfully!');
}

// Function to test React integration
function testReactIntegration() {
  try {
    Logger.log('Testing React integration');
    
    const testData = {
      type: 'confirm',
      timestamp: new Date().toISOString(),
      name: 'Test User from React',
      phone: '0123456789',
      email: 'test@react.com',
      message: 'Test message from React integration'
    };
    
    const spreadsheetId = '1k6FC5cA7aZMtxfMK5347VW8PkJN7tS5pAKRmwrIulKo';
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    
    let sheet = spreadsheet.getSheetByName('Xác nhận tham gia');
    if (!sheet) {
      sheet = spreadsheet.insertSheet('Xác nhận tham gia');
    }
    
    const rowData = prepareRowData(testData);
    sheet.appendRow(rowData);
    
    Logger.log('React integration test successful');
  } catch (error) {
    Logger.log('Error in testReactIntegration: ' + error.toString());
  }
}

 