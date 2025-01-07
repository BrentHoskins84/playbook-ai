import { NavigateAction, View } from "react-big-calendar";

// Custom toolbar component for better control over the navigation UI
interface CustomToolbarProps {
  date: Date;
  view: View;
  views: View[];
  label: string;
  onNavigate: (action: NavigateAction) => void;
  onView: (view: View) => void;
}

export const CustomToolbar: React.FC<CustomToolbarProps> = ({
  date,
  view,
  views,
  label,
  onNavigate,
  onView,
}) => {
  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button type="button" onClick={() => onNavigate("TODAY")}>
          Today
        </button>
        <button type="button" onClick={() => onNavigate("PREV")}>
          Back
        </button>
        <button type="button" onClick={() => onNavigate("NEXT")}>
          Next
        </button>
      </span>
      <span className="rbc-toolbar-label">{label}</span>
      <span className="rbc-btn-group">
        {views.map((name) => (
          <button
            key={name}
            type="button"
            className={view === name ? "rbc-active" : ""}
            onClick={() => onView(name)}
          >
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </button>
        ))}
      </span>
    </div>
  );
};
