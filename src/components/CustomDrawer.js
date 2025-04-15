import { createDrawerNavigator } from "@react-navigation/drawer";
import Checklist from "../screens/Checklist";
import ChecklistDetails from "../screens/ChecklistDetails";

const Drawer = createDrawerNavigator();

export default function CustomDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="Checklist"
        component={Checklist}
        options={{ title: "My Checklist" }} // Customize title
      />
      <Drawer.Screen
        name="ChecklistDetails"
        component={ChecklistDetails}
        options={{ title: "Checklist Details" }} // Customize title
      />
    </Drawer.Navigator>
  );
}