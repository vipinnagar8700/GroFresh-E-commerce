Option Explicit

Dim objFSO, objFolder, objFile, objTextStream, objErrorStream
Dim strFolderPath, strOutputFile, strErrorFile

' Create a FileSystemObject
Set objFSO = CreateObject("Scripting.FileSystemObject")

' Get the folder path of the script
strFolderPath = objFSO.GetParentFolderName(WScript.ScriptFullName)

' Display the folder path (for testing)
WScript.Echo "Script folder path: " & strFolderPath

' Define the output file path
strOutputFile = strFolderPath & "\output.txt"

' Define the error log file path
strErrorFile = strFolderPath & "\error.log"

' Create FileSystemObject
Set objFSO = CreateObject("Scripting.FileSystemObject")

' Create or append to the output file
Set objTextStream = objFSO.CreateTextFile(strOutputFile, True)
objTextStream.WriteLine "File Path" & vbTab & "URLs and IP Addresses"

' Create or append to the error log file
Set objErrorStream = objFSO.CreateTextFile(strErrorFile, True)

' Start recursive search through folders and subfolders
ProcessFolder objFSO.GetFolder(strFolderPath)

' Close output and error log files
objTextStream.Close
objErrorStream.Close

MsgBox "Script execution completed. Results written to: " & strOutputFile & vbCrLf & _
       "Error log written to: " & strErrorFile, vbInformation

' Subroutine to process each folder recursively
Sub ProcessFolder(objFolder)
    Dim objFile
    Dim objSubFolder

    ' Process files in the current folder
    For Each objFile In objFolder.Files
        CheckFile objFile
    Next

    ' Recursively process subfolders
    For Each objSubFolder In objFolder.SubFolders
        ProcessFolder objSubFolder
    Next
End Sub

' Subroutine to check each file for URLs and IP addresses
Sub CheckFile(objFile)
    Dim strFilePath, strLine, strResult
    Dim objRegEx

    ' Get file path
    strFilePath = objFile.Path

    ' Create regular expression object
    Set objRegEx = New RegExp
    objRegEx.IgnoreCase = True
    objRegEx.Global = True

    ' Regular expression pattern to match URLs and IP addresses
    objRegEx.Pattern = "(https?|ftp):\/\/[^\s/$.?#].[^\s]*|([0-9]{1,3}\.){3}[0-9]{1,3}"

    ' Open the file for reading
    On Error Resume Next
    Set objTextStream = objFSO.OpenTextFile(strFilePath)

    ' Check if file was opened successfully
    If Err.Number <> 0 Then
        objErrorStream.WriteLine "Error reading file: " & strFilePath & vbCrLf & "Error: " & Err.Description & vbCrLf
        Err.Clear
        On Error GoTo 0
    Else
        ' Read each line and search for matches
        Do Until objTextStream.AtEndOfStream
            strLine = objTextStream.ReadLine
            If objRegEx.Test(strLine) Then
                strResult = strResult & vbTab & objRegEx.Execute(strLine)(0)
            End If
        Loop

        ' Close the file
        objTextStream.Close
        On Error GoTo 0

		' If matches found, write to output file
		If Len(strResult) > 0 Then
			Set objTextStream = objFSO.OpenTextFile(strOutputFile, 8, True)
			objTextStream.WriteLine "File Path" & vbTab & "Domain Name" & vbTab & "URL"
			' Split strResult based on the tab character
			Dim arrURLs
			arrURLs = Split(strResult, vbTab)
			' Write each URL and its domain name on a new line
			Dim i
			For i = 1 To UBound(arrURLs)
				Dim strURL
				strURL = arrURLs(i)
				' Extract domain name from URL
				Dim domainStart, domainEnd
				domainStart = InStr(1, strURL, "://") + Len("://")
				domainEnd = InStr(domainStart, strURL, "/")
				Dim domainName
				If domainEnd > 0 Then
					domainName = Mid(strURL, domainStart, domainEnd - domainStart)
				Else
					domainName = Mid(strURL, domainStart)
				End If
				objTextStream.WriteLine strFilePath & vbTab & domainName & vbTab & strURL
			Next
			objTextStream.Close
		End If




    End If
End Sub

