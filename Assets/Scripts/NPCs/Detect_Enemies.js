#pragma strict

public class Detect_Enemies extends MonoBehaviour
{
	public var locating : boolean = true;

	function OnTriggerEnter(col : Collider)
	{
		if (locating)
		{
			if (col.gameObject.tag == "Enemy")
			{
				transform.LookAt(col.gameObject.transform);
				gameObject.transform.parent.GetComponent(NPC).SendMessage("Attack", col.gameObject);
				locating = false;
			}
		}
	}

	function Locate_Enemy(new_detection : boolean)
	{
		locating = new_detection;
	}
}