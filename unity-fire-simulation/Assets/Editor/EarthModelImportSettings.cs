// SI-assisted: generated with Codex, reviewed and edited by Esquivel & Elias (21 PyroRangers).
using UnityEditor;

namespace FireSimulation.Editor
{
    // Keep the full-resolution Earth in one mesh; the scene loader expects a single mesh asset.
    [InitializeOnLoad]
    public sealed class EarthModelImportSettings : AssetPostprocessor
    {
        const string EarthPath = "Assets/TravelModels/Earth.obj";

        static EarthModelImportSettings()
        {
            EditorApplication.delayCall += RepairExistingImport;
        }

        void OnPreprocessModel()
        {
            if (assetPath != EarthPath) return;
            var importer = (ModelImporter)assetImporter;
            importer.indexFormat = ModelImporterIndexFormat.UInt32;
            importer.isReadable = true;
        }

        static void RepairExistingImport()
        {
            if (EditorApplication.isPlayingOrWillChangePlaymode) return;
            var importer = AssetImporter.GetAtPath(EarthPath) as ModelImporter;
            if (importer == null) return;
            if (importer.indexFormat != ModelImporterIndexFormat.UInt32 || !importer.isReadable)
            {
                importer.indexFormat = ModelImporterIndexFormat.UInt32;
                importer.isReadable = true;
                importer.SaveAndReimport();
            }
            // Refresh references that may still point to one of the former 16-bit mesh parts.
            DestinationTravelAssets.BindAll();
        }
    }
}
