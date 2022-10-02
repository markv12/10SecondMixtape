using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class CrowdSpawner : MonoBehaviour
{

    public Sprite[] crowdSprites;
    public float spawnCount = 30;

    // Start is called before the first frame update
    void Start()
    {
        float maxWidth = transform.GetComponent<RectTransform>().rect.width / 2;
        float maxHeight = transform.GetComponent<RectTransform>().rect.height / 2;

        for (int i = 0; i < spawnCount; i++) {
            // create new image and attach it
            GameObject newImage = new GameObject();
            newImage.transform.SetParent(this.transform);
            newImage.AddComponent<RectTransform>();
            newImage.AddComponent<Image>();
            newImage.transform.localScale = new Vector3(Random.Range(4.0f, 7.0f), Random.Range(4.0f, 7.0f), 1);

            newImage.transform.GetComponent<RectTransform>().pivot = new Vector2(0.5f, 0.0f);
            newImage.transform.localPosition = new Vector3(
                Random.Range(-1 * maxWidth * 1.1f, maxWidth * 1.1f),
                -1 * maxHeight * 0.15f,
                0
            );
            newImage.GetComponent<Image>().sprite = crowdSprites[Random.Range(0, crowdSprites.Length)];

            newImage.AddComponent<CrowdAnimator>();
        }
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
