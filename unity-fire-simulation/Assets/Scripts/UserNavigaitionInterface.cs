using FireSimulation;
using TMPro;
using UnityEngine;

public class UserNavigaitionInterface : MonoBehaviour
{
    [SerializeField] private TextMeshProUGUI text;
    [SerializeField] private DestinationTravel travel;


    void Update()
    {
        if (travel.IsTravelling)
        {
            if (text.gameObject.activeSelf) text.gameObject.SetActive(false);
        }
        else
        {
            if (!text.gameObject.activeSelf) text.gameObject.SetActive(true);
        }

    }

}
