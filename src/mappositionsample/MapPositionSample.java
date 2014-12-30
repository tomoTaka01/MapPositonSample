package mappositionsample;

import java.net.URL;
import javafx.application.Application;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import javafx.stage.Stage;

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
        VBox root = new VBox(10);
        root.getChildren().addAll(webView);
        Scene scene = new Scene(root, 500, 500);
        
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
    
}
