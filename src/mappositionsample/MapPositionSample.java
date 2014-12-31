package mappositionsample;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.net.URL;
import java.util.logging.Level;
import java.util.logging.Logger;
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
import javafx.stage.FileChooser;
import javafx.stage.Stage;
import netscape.javascript.JSObject;
import org.json.simple.JSONArray;
import org.json.simple.JSONValue;

/**
 * save google map infomation to JSON file
 * load JSON file & draw google Polyline
 * @author tomo
 */
public class MapPositionSample extends Application {
    
    @Override
    public void start(Stage stage) {
        WebView webView = new WebView();
        WebEngine engine = webView.getEngine();
        URL url = getClass().getResource("sample.html");
        // set method to JavaScript
        engine.load(url.toExternalForm());
        JSObject win = (JSObject) engine.executeScript("window");
        win.setMember("app", new JavaApp(stage));
        
        VBox root = new VBox(10);
        HBox hbox1 = new HBox(10);
        hbox1.setPadding(new Insets(5));
        hbox1.setAlignment(Pos.CENTER_RIGHT);
        Button loadBtn = new Button("load json to map");
        loadBtn.setOnAction(e -> {
            FileChooser fileChooser = new FileChooser();
            File file = fileChooser.showOpenDialog(stage);
            try (BufferedReader reader = new BufferedReader(new FileReader(file))){
                // file to json
                Object obj = JSONValue.parse(reader);
                // call JacaScript method with JSON object
                engine.executeScript("drawPolylineFromJson(" + obj + ")");
            } catch (Exception ex) {
                Logger.getLogger(MapPositionSample.class.getName()).log(Level.SEVERE, null, ex);
            }
        });
        Button exitBtn = new Button("exit");
        exitBtn.setOnAction(e -> {
            Platform.exit();
        });
        hbox1.getChildren().addAll(loadBtn, exitBtn);
        root.getChildren().addAll(webView, hbox1);
        Scene scene = new Scene(root, 900, 600);
        
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
    
    /**
     * class for JavaScript
     */
    public class JavaApp {
        private Stage stage;
        public JavaApp(Stage stage) {
            this.stage = stage;
        }

        /**
         * called from JavaScript by clicking [save to Json] button
         * @param infos 
         */
        public void getInfoList(String infos) {
            FileChooser fileChooser = new FileChooser();
            File file = fileChooser.showSaveDialog(this.stage);
            try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
                writer.write(infos);
            } catch (IOException ex) {
                Logger.getLogger(MapPositionSample.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
}
