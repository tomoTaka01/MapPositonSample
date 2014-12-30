package mappositionsample;

import java.net.URL;
import javafx.application.Application;
import javafx.application.Platform;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import javafx.stage.Stage;
import netscape.javascript.JSObject;
import org.json.simple.JSONObject;
/**
 *
 * @author tomo
 */
public class MapPositionSample extends Application {
    
    @Override
    public void start(Stage stage) {
        WebView webView = new WebView();
        WebEngine engine = webView.getEngine();
        URL url = getClass().getResource("sample.html");
        engine.load(url.toExternalForm());
        JSObject win = (JSObject) engine.executeScript("window");
        win.setMember("app", new JavaApp());
        
        VBox root = new VBox(10);
        HBox hbox1 = new HBox(10);
        hbox1.setPadding(new Insets(5));
        hbox1.setAlignment(Pos.CENTER_RIGHT);
        Button saveBtn = new Button("exit");
        saveBtn.setOnAction(e -> {
            Platform.exit();
        });
        hbox1.getChildren().addAll(saveBtn);
        root.getChildren().addAll(webView, hbox1);
        Scene scene = new Scene(root, 800, 600);
        
        stage.setTitle("Map Position Sample");
        stage.setScene(scene);
        stage.show();
    }

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        launch(args);
    }
    
public class JavaApp{
    public void getInfoList(String infos){
        System.out.println(infos);
        // TODO save file
    }
}
    
}
