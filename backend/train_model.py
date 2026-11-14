# SI-assisted: generated with Gemini, reviewed and edited by Elias, Pina & Celina
# Source: NASA PSI, BASS-II (PSI-25), DOI 10.60555/4qc4-de67, CC0-1.0
# Reference: Olson et al., NASA/TM-20210011385 (2021)
"""
CLI entrypoint to execute the Physics-Informed Neural Network (PINN) & Stratified 5-Fold
Cross-Validation training pipeline on the 79 verified NASA PSI BASS-II (PSI-25) empirical records.

Usage:
    python3 backend/train_model.py
"""
import pathlib
import sys

REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from backend.app.ml_pipeline import METRICS_OUTPUT_PATH, WEIGHTS_OUTPUT_PATH, run_training_pipeline


def main() -> None:
    metrics = run_training_pipeline()
    clf = metrics["classification_metrics"]
    reg = metrics["regression_metrics"]
    cm = clf["confusion_matrix"]

    print("=" * 78)
    print("[PROJECT_NAME] — NASA BASS-II (PSI-25) PINN TRAINING & VALIDATION PIPELINE")
    print("=" * 78)
    print(f"Dataset Grounding : {metrics['grounding_sources']['psi_dataset']} (DOI: {metrics['grounding_sources']['doi']})")
    print(f"Physical Equations: {metrics['grounding_sources']['ntrs_report']} (Olson Eq. 6.1 & Bhattacharjee Eq. 2.2-2.5)")
    print(f"Empirical Records : {metrics['why_small_data_succeeds']['empirical_records_count']} ISS glovebox states + "
          f"{metrics['why_small_data_succeeds']['collocation_boundary_points']} physics boundary collocation points")
    print(f"Execution Time    : {metrics['training_execution_ms']:.2f} ms")
    print("-" * 78)
    print("[1] IGNITION vs. EXTINCTION/QUENCH CLASSIFICATION (Stratified 5-Fold CV):")
    print(f"    - Accuracy  : {clf['accuracy_pct']:.2f}%")
    print(f"    - Precision : {clf['precision_pct']:.2f}%")
    print(f"    - Recall    : {clf['recall_pct']:.2f}%")
    print(f"    - F1-Score  : {clf['f1_score_pct']:.2f}%")
    print(f"    - Confusion : TP={cm['true_positives_sustained']}, TN={cm['true_negatives_quenched']}, "
          f"FP={cm['false_positives']}, FN={cm['false_negatives']}")
    print("-" * 78)
    print("[2] FLAME SPREAD RATE Vf (mm/s) PINN REGRESSION (5-Fold CV):")
    print(f"    - R^2 Score : {reg['r2_score']:.4f}")
    print(f"    - RMSE      : {reg['rmse_mm_s']:.4f} mm/s")
    print(f"    - MAE       : {reg['mae_mm_s']:.4f} mm/s")
    print("-" * 78)
    print("[3] PHYSICAL FEATURE IMPORTANCE (Permutation Sensitivity):")
    for item in metrics["feature_importance"]:
        print(f"    - {item['importance_pct']:5.2f}% | {item['feature_name']}")
    print("-" * 78)
    print(f"Saved validation metrics : {METRICS_OUTPUT_PATH}")
    print(f"Saved model weights      : {WEIGHTS_OUTPUT_PATH}")
    print("=" * 78)


if __name__ == "__main__":
    main()

