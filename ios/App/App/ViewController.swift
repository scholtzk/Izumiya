import UIKit
import Capacitor

class ViewController: CAPBridgeViewController {
    
    override var prefersStatusBarHidden: Bool {
        return true
    }
    
    override var prefersHomeIndicatorAutoHidden: Bool {
        return true
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Set up full screen mode
        if #available(iOS 11.0, *) {
            setNeedsUpdateOfScreenEdgesDeferringSystemGestures()
        }
    }
    
    @available(iOS 11.0, *)
    override func preferredScreenEdgesDeferringSystemGestures() -> UIRectEdge {
        return [.top, .bottom]
    }
} 