param(
  [Parameter(Mandatory = $true)]
  [string]$InputPath,

  [Parameter(Mandatory = $true)]
  [string]$OutputPath
)

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
  $workbook = $excel.Workbooks.Open($InputPath, 0, $true)
  $rows = [System.Collections.Generic.List[object]]::new()
  $sheetParameters = @{
    "INeS PESO" = "weight"
    "INeS LUNGHEZZA" = "length"
    "INeS CIRCONFERENZA CRANICA" = "headCircumference"
  }

  foreach ($sheet in $workbook.Worksheets) {
    $parameter = $sheetParameters[$sheet.Name]
    if (-not $parameter) { continue }

    for ($rowIndex = 5; $rowIndex -le 84; $rowIndex++) {
      $week = [int]$sheet.Cells.Item($rowIndex, 1).Value2
      $sex = if ([string]$sheet.Cells.Item($rowIndex, 2).Value2 -eq "M") { "male" } else { "female" }
      $firstborn = [string]$sheet.Cells.Item($rowIndex, 3).Value2 -eq "SI"

      $rows.Add([ordered]@{
        parameter = $parameter
        sex = $sex
        firstborn = $firstborn
        week = $week
        l = [double]$sheet.Cells.Item($rowIndex, 4).Value2
        m = [double]$sheet.Cells.Item($rowIndex, 5).Value2
        s = [double]$sheet.Cells.Item($rowIndex, 6).Value2
      })
    }
  }

  $json = $rows | ConvertTo-Json -Depth 4 -Compress
  $content = @"
// Generated from INeS_LMS.XLS with scripts/extract-ines-lms.ps1.
// Source: https://www.inescharts.com/

export type InesLmsDatum = {
  parameter: "weight" | "length" | "headCircumference";
  sex: "male" | "female";
  firstborn: boolean;
  week: number;
  l: number;
  m: number;
  s: number;
};

export const inesLmsData: InesLmsDatum[] = $json;
"@

  $absoluteOutputPath = [IO.Path]::GetFullPath($OutputPath)
  [IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($absoluteOutputPath)) | Out-Null
  [IO.File]::WriteAllText($absoluteOutputPath, $content, [Text.UTF8Encoding]::new($false))
} finally {
  if ($workbook) { $workbook.Close($false) }
  $excel.Quit()
  [Runtime.InteropServices.Marshal]::ReleaseComObject($excel) | Out-Null
}
