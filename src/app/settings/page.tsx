export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">సెట్టింగ్స్</h1>
      <div className="grid gap-4 max-w-xl">
        <div className="flex items-center justify-between">
          <span>డార్క్ మోడ్</span>
          <span className="text-white/60">సిస్టమ్ ఆధారంగా</span>
        </div>
        <div className="flex items-center justify-between">
          <span>ఫాంట్ సైజు</span>
          <span className="text-white/60">డిఫాల్ట్</span>
        </div>
        <div className="flex items-center justify-between">
          <span>డేటా సేవర్</span>
          <span className="text-white/60">ఆఫ్</span>
        </div>
      </div>
    </div>
  );
}
